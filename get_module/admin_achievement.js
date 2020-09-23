const getData=require('../getdata')
const query=require('../query')

module.exports=async (req,res)=>{
    let id=req.query.id
    let count=req.query.count||0
    try{
        let result=await getData(id,count,query.getAdminDownWork)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'OK',data:{result}})
    }catch(error){
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}