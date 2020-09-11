const getdata=require('../getdata')
const transaction=require('../transcations')
const dateNow=require('../date_now')
const querystring=require('querystring')

module.exports=async (req,res)=>{
    try{
        //根据cookie值判断用户是否登录
        if(req.cookies[loginId]==req.body.adminId){
        //配制确认数据
        let confirm_create_file={
            file_type:req.body.file_type,
            is_available:true,
            keywords:req.body.keywords,
            state:'normal',
            file_desc:req.body.file_desc
        }
        let data={
            adminId:req.body.adminId,
            file_id:req.body.file_id,
            confirm_create_file,
            confirm_create_log:{
                log_type:'creation_confirm',
                file_id:req.body.file_id,
                C:dateNow(),
                D:querystring.stringify(confirm_create_file),
                F:req.body.adminId,
                last_id:req.body.last_id
            },
            confirm_create_last_id:req.body.confirm_create_last_id,
            create_confirm_admin_work_total:req.body.create_confirm_admin_work_total
        }
        let result=await getdata(data,transaction.confirm_create_file)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'OK'})
        //没有登录的id无法创建文件
        }else{
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            res.send({result:'NG'})
        }
    }catch(error){
        console.log('[ERR]',decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}