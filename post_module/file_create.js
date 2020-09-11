const getdata=require('../getdata')
const query=require('../query')
const transcation=require('../transcations')
const dateNow=require('../date_now')
const querystring=require('querystring')
const getzimu=require('../zimu')

module.exports=async (req,res)=>{
    //根据cookie值判断用户是否登录
    if(req.cookies[loginId]==req.body.userid){
        try{
            //判断文件名是否存在
            if(await getdata(req.body.fileid,query.getFileByIds)){
                //配制创建文件所需要的数据
                let create_file={
                    file_name:req.body.file_name,
                    flle_name_en:getzimu(file_name),
                    file_type:req.body.file_type,
                    is_available:false,
                    origin_size:req.file.size,
                    keywords:req.body.keywords, //'keywords1,keywords2,keywords3'
                    state:"creating",
                    file_path:req.file.path,
                    file_owner:req.body.userid,
                    file_desc:req.body.file_desc
                }
                let data={
                    userId:req.body.userid,
                    create_file,
                    create_file_log:{
                        log_type:'creation',
                        A:dateNow(),
                        B:querystring.stringify(create_file),
                        E:req.body.userid
                    },
                    create_file_user_log_last_id:req.body.create_file_user_log_last_id,
                    create_file_user_create_total:req.body.create_total
                }
                let result=await getdata(data,transcation.create_file_transcation)
                console.log('[OK]',decodeURIComponent(req.originalUrl))
                res.send({result:'OK'})
                return
            }
        }catch(error){
            console.log('[ERR]',decodeURIComponent(req.originalUrl),error)
            res.status(500).send({result:'NG'})
            return
        }
        //重名了
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'NG'})
    //没有登录的id无法创建文件
    }else{
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'NG'})
    }
}