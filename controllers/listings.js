const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
        populate:{path: "author",
    },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });
}

module.exports.createListing = async (req,res,next) =>{
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1        
            })
            .send()



        let url = req.file.path;
        let filename = req.file.filename;

        //  Normalize checkboxes
        const { isFeatured, isOffer} = req.body.listing;
        
        const newListing = new Listing({
        ...req.body.listing,
        isFeatured: isFeatured === "true",
        isOffer: isOffer === "true",
        });

        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        newListing.geometry = response.body.features[0].geometry;

        
        
        let savedListing = await newListing.save();
        console.log(savedListing);
        
        req.flash("success","New Lisiting is created");
        res.redirect("/listings");
    
}

module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    } 
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_256");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
}

const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let originalListing = await Listing.findById(id);

    // Convert checkbox values to booleans
    const updateData = {
        ...req.body.listing,
        isFeatured: req.body.listing.isFeatured === "true",
        isOffer: req.body.listing.isOffer === "true"
    };

    // Prevent price = 0 or negative
    if (!updateData.price || updateData.price <= 0) {
        req.flash("error", "Price must be greater than 0.");
        return res.redirect(`/listings/${id}/edit`);
    }

    // If offer is unchecked, remove offerPrice
    if (!updateData.isOffer) {
        updateData.offerPrice = undefined;
    }

    // If offer is checked but no value provided
    if (updateData.isOffer && (!updateData.offerPrice || updateData.offerPrice === "")) {
        req.flash("error", "Please provide an offer price if Offer category is selected.");
        return res.redirect(`/listings/${id}/edit`);
    }

    // STEP 1: Check if the location has changed
    if (req.body.listing.location && req.body.listing.location !== originalListing.location) {
        // STEP 2: Geocode the new location
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        // Check if geocoding was successful
        if (response.body.features && response.body.features.length) {
            // STEP 3: Update the geometry field with new coordinates
            updateData.geometry = response.body.features[0].geometry;
        } else {
            // Handle case where geocoding fails
            req.flash("error", "Could not find coordinates for the new location. The map will not be updated.");
            // You can choose to proceed with other updates or return here
        }
    }

    // STEP 4: Update the listing in the database with the new data (including geometry if updated)
    let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    // If a new image was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing is updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req,res) =>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}