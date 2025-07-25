module.exports = (fn) =>{
    return (req,res,next) => {
        fn(req,res,next).catch(next);//koi error catch ho to next call ho jaye
    }
}