const getData=require('../getdata')
const transcations = require('../transcations')
const dateNow=require('../date_now')
const getdata = require('../getdata')

module.exports=async (req,res)=>{
    //根据cookie值判断用户是否登录
    if(req.cookies[loginId]==req.body.userid){
        try{
            let data={
                file_id:req.body.file_id,
                user_id:req.body.userid,
                download_file_log:{
                    log_type:'download',
                    file_id:req.body.file_id,
                    A:dateNow(),
                    E:req.body.userid,
                    last_id:req.body.last_id
                },
                download_file_download_total:req.body.download_file_download_total,
                file_download_user_log:req.body.file_download_user_log,
                user_download_total:req.body.user_download_total
            }
            let result=getdata(data,transcations.download_file_transaction)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            res.send({result:'OK'})
        }catch(error){
            console.log('[ERR]',decodeURIComponent(req.originalUrl),error)
            res.status(500).send({result:'NG'})
        }
    }else{
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'NG'})
    }
}
