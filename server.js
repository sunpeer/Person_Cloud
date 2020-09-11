const express = require('express')
const path=require('path')
const fs=require('fs')
const crypto=require('crypto')
const fileWatcher = require('./fs_watch')
const zip = require('./file_zip')
const fileWatcher=require('./fs_watch')
const multer=require('multer')
const {publicKey,privateKey}=crypto.generateKeyPairSync('rsa',{
    modulusLength:2048
})
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'E:/personal_Cloud_Origin_Dir')
    },
    filename:function(req,file,cb){
        cb(null,req.query.file_name)
    }
})
var upload=multer({storage})
var app = express()

fileWatcher(async function(filename){
    let ziplog=await zip(filename)
    console.log(ziplog) //打印zip信息
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// cookie parser
app.use((req, res, next) => {
    req.cookies = {}, (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
      let crack = pair.indexOf('=')
      if(crack < 1 || crack == pair.length - 1) return
      req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(pair.slice(crack + 1)).trim()
    })
    next()
  })

//crpto setting
app.use((req,res,next)=>{
    //因为一般POST请求是传输比较保密的信息
    if(req.method=="POST")
        req.keys={publicKey,privateKey}
    if(req.baseUrl='/crypto_ready'){
        res.send({result:'OK',data:{publicKey}})
    }else{
        next()
    }
})

app.post('/file/create',upload.single('file'),(req,res,next)=>{
    next(); 
})

fs.readdirSync(path.join(__dirname, 'post_module')).forEach(file=>{
    let route=file.replace(/_/g,'/')
    let question=require(path.join(__dirname, 'post_module',file))

    app.post(route,question)
})

fs.readdirSync(path.join(__dirname, 'get_module')).forEach(file=>{
    let route=file.replace(/_/g,'/')
    let question=require(path.join(__dirname, 'get_module',file))

    app.get(route,question)
})