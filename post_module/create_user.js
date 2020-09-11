const transaction=require('../transcations')
const crypto=require('crypto')
const getData=require('../getdata')
const dateNow=require('../date_now')


//传来创建账户的信息，返回账户分配到的id
module.exports=async (req,res)=>{
    let pwd=crypto.privateDecrypt({
        key:req.keys.privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash:"sha256"
    },req.body.pwd).toString()
    try{
        let da={
            insertData:{
                pwd,
                name:req.body.name,
                create_time:dateNow()
            },
            group:req.body.group
        }
        let result=await getData(da,transaction.create_user_transaction)
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        res.append('Set-Cookie', `loginId=${result.insertId};isLogin=true`)
        res.send({result:'OK',data:{id:result.insertId}})
    }catch(error){
        //执行结果出错
        console.log('[ERR]',decodeURIComponent(req.originalUrl),req.body,error)
        res.status(500).send({result:'NG'})
    }
}