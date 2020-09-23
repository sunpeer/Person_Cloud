const transaction=require('../transcations')
const crypto=require('crypto')
const getData=require('../getdata')
const dateNow=require('../date_now')


//传来创建账户的信息，返回账户分配到的id
module.exports=async (req,res)=>{
    try{
        // let pwd=crypto.privateDecrypt({
        //     key:req.keys.privateKey,
        //     padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,
        //     oaepHash:"sha256"
        // },Buffer.from(req.body.pwd)).toString()
        let pwd=req.body.pwd
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
        var date=new Date();
        date.setMonth(date.getMonth()+1)
        res.append('Set-Cookie', `loginId=${req.body.id};Path=/;expires=${date.toUTCString()}`)
        res.send({result:'OK',data:{id:result.insertId}})
    }catch(error){
        //执行结果出错
        console.log('[ERR]',decodeURIComponent(req.originalUrl),req.body,error)
        res.status(500).send({result:'NG'})
    }
}