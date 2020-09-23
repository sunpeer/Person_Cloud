const query=require('../query')
const getData=require('../getdata')


module.exports=async (req,res)=>{
    try{
        let result=await getData(req.query.id,query.getUserById)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'OK',data:{
            id:result.id,
            name:result.name,
            create_time:result.create_time,
            download_id:result.download_id, //最近下载的一个user_log id
            create_id:result.create_id,    //最近创建的一个user_log id
            download_total:result.download_total,
            create_total:result.create_total
        }})
    }catch(error){
        console.log('[ERR]',decodeURIComponent(req.originalUrl),req.body.error)
        res.status(500).send({result:'NG'})
    }
}