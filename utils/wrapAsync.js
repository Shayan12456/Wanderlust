module.exports = (fn)=>{
    return (req, res, next)=>{
        fn(req, res, next).catch(next);//new way of writing .catch((err)=>next(err));
    }
}