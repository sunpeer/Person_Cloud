const transcations = require('../transcations')
const dateNow=require('../date_now')
const getdata = require('../getdata')
const query=require('../query')
const fs=require('fs')

module.exports=async (req,res)=>{
    //根据cookie值判断用户是否登录
    if(req.cookies['loginId']==req.body.userid){
        try{
            let data={
                file_id:req.body.file_id,
                user_id:req.body.userid,
                download_file_log:{
                    log_type:'download',
                    file_id:req.body.file_id,
                    A:dateNow(),
                    E:req.body.userid,
                    last_id:req.body.last_id||null //这个代表这个文件的最近一次下载
                },
                download_file_download_total:req.body.download_file_download_total, //这个代表这个文件的下载量
                file_download_user_log:req.body.file_download_user_log||null,   //这个代表这个用户的最近下载
                user_download_total:req.body.user_download_total    //这个代表用户的下载数
            }
            let result=await getdata(data,transcations.download_file_transaction)
            //访问数据库得到文件路径
            let ids=[]
            ids.push(req.body.file_id)
            result=await getdata(ids,query.getFileByIds)
            let fullFileName=result[0][0].file_path
            console.log('[OK]',decodeURIComponent(req.originalUrl),fullFileName)
            // res.send({result:'OK'})
            // let fileName=fullFileName.split('\\').pop()
            res.sendFile(fullFileName+'.zip',{
                headers:{'Content-Disposition':"attachment"}
            })
            // let load=fs.createReadStream(result[0][0].file_path)
            // res.writeHead(200,{
            //     'Content-Type':'application/force-download',
            //     'Content-Disposition':'attachment'
            // })
            // load.pipe(res)
        }catch(error){
            console.log('[ERR]',decodeURIComponent(req.originalUrl),error)
            res.status(500).send({result:'NG'})
        }
    }else{
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'NG'})
    }
}
