const query=require('../query')
const crypto=require('crypto')
const getData=require('../getdata')

//获得admin的数据
module.exports=async (req,res)=>{
    // //检查cookie
    // if(req.cookies[isLogin]==true){
    //        async ()=>{
    //             await
    //         }
    // }
    let pwd=crypto.privateDecrypt({
        key:req.keys.privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash:"sha256"
    },req.body.pwd).toString()
    try{
        let result=await getData(req.id,query.getAdminById)
        //成功登录
        if(result.pwd==pwd){
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            res.append('Set-Cookie', `loginId=${req.body.id};isLogin=true`)
            res.send({result:'OK',data:{
                id:result.id,
                name:result.name,
                create_time:result.create_time,
                work_id:result.download_id, //最近工作的一个admin_log id
                work_total:result.create_time,    //工作数
            }})
        }else{
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            res.send({result:'NG'})
        }
    }catch(error){
        //查询数据库出错
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}