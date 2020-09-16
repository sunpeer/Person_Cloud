const getdata = require('../getdata')
const transcations = require('../transcations')

module.exports=async (req,res)=>{
    //根据cookie值判断用户是否登录
    if(req.cookies['loginId']==req.body.userid){
        try{
            //配制调用数据库的数据 
            let data={
                id:req.body.file_id,
                modify:{
                    keywords:req.body.keywords,
                    file_desc:req.body.file_desc,
                }
            }
            let result=getdata(data,transcations.modify_file_transaction)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            res.send({result:'OK'})
        }catch(error){
            console.log('[ERR]',decodeURIComponent(req.originalUrl),error)
            res.status(500).send({result:'NG'})
        }
    //没有登录的id无法创建文件
    }else{
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.send({result:'NG'})
    }
}