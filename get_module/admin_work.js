const getData=require('../getdata')
const query=require('../query')
const getdata = require('../getdata')

module.exports=async (req,res)=>{
    let count=req.query.count||0
    try{
        let result=await getdata(count,query.getAdminWork)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        let ids=[]
        result.forEach((item)=>{
            ids.push(item.id)
        })
        res.send({result:'OK',data:{ids}})
    }catch(error){
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}