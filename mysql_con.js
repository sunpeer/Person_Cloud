const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'123456',
    // database:'person_cloud_database'
    database:'person_cloud_database'
});

const connectHandler=()=>new Promise((resolve,reject)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            // console.error('连接数据库失败:\n');
            reject(err)
        }else{
            resolve(connection)
        }
    })
});


module.exports=connectHandler;