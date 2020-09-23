const query=require('../query')
const getData=require('../getdata')

module.exports=async (req,res)=>{
    try{
        let result=await getData(req.query.id,query.getAdminById)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'OK',data:{
            id:result.id,
            name:result.name,
            create_time:result.create_time,
            work_id:result.work_id, //最近工作的一个admin_log id
            work_total:result.work_total,    //工作数
        }})
    }catch(error){
        //查询数据库出错
        console.log('[ERR]', decodeURIComponent(req.originalUrl),req.body,error)
        res.status(500).send({result:'NG'})
    }
}