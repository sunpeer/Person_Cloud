const query=require('../query')
const getData=require('../getdata')
const crypto=require('crypto')

//获得admin的数据
module.exports=async (req,res)=>{
    // //检查cookie
    // if(req.cookies[isLogin]==true&&){
    //        async ()=>{
    //             await
    //         }
    // }
    let pwd=crypto.privateDecrypt({
        key:req.keys.privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash:"sha256"
    },Buffer.from(req.body.pwd)).toString()
    try{
        let result=await getData(req.body.id,query.getUserById)
        //成功登录
        if(result.pwd==pwd){
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            res.append('Set-Cookie', `loginId=${req.body.id};isLogin=true`)
            res.send({result:'OK',data:{
                id:result.id,
                name:result.name,
                create_time:result.create_time,
                download_id:result.download_id, //最近下载的一个user_log id
                creat_id:result.create_id,    //最近创建的一个user_log id
                download_total:result.download_total,
                create_total:result.create_total
            }})
        }else{
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            res.send({result:'NG'})
        }
    }catch(error){
        //查询数据库出错
        console.log('[ERR]', decodeURIComponent(req.originalUrl),req.body,error)
        res.status(500).send({result:'NG'})
    }
}