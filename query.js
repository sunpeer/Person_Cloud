const connectHandler=require('./mysql_con');
const CRUD = require('./CRUD');
const events=require('events')

//获得用户的文件创建信息
async function getUserCreationData(startId,count,downEvent)
{
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let searchCount=0;
    function getFile(id,datas,downEvent){
    CRUD.queryByIndex('user_log_table',["log_id","last_id"],id,connection,(error,results,fields)=>{
            if(error){
                console.error(`获得userl_log_table的id=${id}的记录失败,已查询${searchCount}`)
                connection.release();
                downEvent.emit('getDown',datas)
            }else{
                let data=JSON.parse(JSON.stringify(results))[0]
                // console.log(JSON.parse(JSON.stringify(results))[0])
                // console.log(results)
                CRUD.queryByIndex('log_table','file_id',data.log_id,connection,(error,results,fields)=>{
                    if(error){
                        console.error(`从log_table的id=${data.log_id}处获得file_id失败，已查询${searchCount}`)
                        connection.release();
                        downEvent.emit('getDown',datas)
                    }else{
                        searchCount++;
                        datas.file_ids.push(JSON.parse(JSON.stringify(results))[0].file_id)
                        if(data.last_id===null) {
                            datas.next_id=null;
                            downEvent.emit('getDown',datas)
                        }else if(count==searchCount){
                            datas.next_id=data.last_id;
                            downEvent.emit('getDown',datas)
                        }else{
                            datas.next_id=data.last_id
                            getFile(data.last_id,datas,downEvent)
                        }
                    }
                })
            }
        })
    }

    datas={
        next_id : startId,
        file_ids : []
    }
    getFile(startId,datas,downEvent)
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })
// getUserCreationData(1,1,myEvent)

//获得用户的下载文件信息
async function getUserDownloadData(startId,count,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let searchCount=0;
    function getFile(id,datas,downEvent){
        CRUD.queryByIndex('user_log_table',["last_id","log_id"],id,connection,(error,results,fields)=>{
            if(error){
                console.error(`获得userl_log_table的id=${id}的记录失败,已查询${searchCount}`)
                connection.release();
                downEvent.emit('getDown',datas)
            }else{
                // console.log(results)
                let data=JSON.parse(JSON.stringify(results))[0]
                CRUD.queryByIndex('log_table','file_id',data.log_id,connection,(error,results,fields)=>{
                    if(error){
                        console.error(`从log_table的id=${data.log_id}处获得file_id失败，已查询${searchCount}`)
                        connection.release();
                        downEvent.emit('getDown',datas)
                    }else{
                        searchCount++
                        datas.file_ids.push(JSON.parse(JSON.stringify(results))[0].file_id)
                        if(data.last_id===null) {
                            datas.next_id=null;
                            downEvent.emit('getDown',datas)
                            connection.release();
                        }else if(count==searchCount){
                            datas.next_id=data.last_id;
                            downEvent.emit('getDown',datas)
                            connection.release();
                        }else{
                            datas.next_id=data.last_id
                            getFile(data.last_id,datas,downEvent)
                        }
                    }
                })
            }
        })
    }
    datas={
        next_id: startId,
        file_ids: []
    }
    getFile(startId,datas,downEvent)
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })
// getUserDownloadData(2,1,myEvent)

//管理员获得work
async function getAdminWork(count,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let limit=count===0?'':`limit ${count}`
    CRUD.queryBycondition('id','file_table','where is_available=false order by `id` desc '+limit,connection,(error,results,fields)=>{
        if(error){
            console.error(`获得待审核创建文件Ids失败`)
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release();
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',(datas,field)=>{
//     console.log(datas,'\n',field)
// }).on('error',value=>{
//     console.log(value)
// })
// getAdminWork(myEvent)

//管理员获得已完成work
async function getAdminDownWork(startId,count,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let searchCount=0;
    function getFile(id,datas,downEvent){
        CRUD.queryByIndex('admin_log_table',['last_id','log_id'],id,connection,(error,results,fields)=>{
            if(error){
                console.error(`获得admin_log_table的id=${id}的记录失败,已查询${searchCount}`)
                connection.release();
                downEvent.emit('getDown',datas)
            }else{
                // console.log(results)
                let data=JSON.parse(JSON.stringify(results))[0]
                CRUD.queryByIndex('log_table',"file_id",data.log_id,connection,(error,results,fields)=>{
                    if(error){
                        console.error(`从log_table的id=${data.log_id}处获得file_id失败，已查询${searchCount}`)
                        connection.release();
                        downEvent.emit('getDown',datas)
                    }else{
                        searchCount++;
                        datas.file_ids.push(JSON.parse(JSON.stringify(results))[0].file_id)
                        if(data.last_id===null) {
                            datas.next_id=null;
                            downEvent.emit('getDown',datas)
                            connection.release();
                        }else if(count==searchCount){
                            datas.next_id=data.last_id;
                            downEvent.emit('getDown',datas)
                            connection.release();
                        }else{
                            datas.next_id=data.last_id
                            getFile(data.last_id,datas,downEvent)
                        }
                    }
                })
            }
        })
    }
    datas={
        next_id:startId,
        file_ids:[]
    }
    getFile(startId,datas,downEvent)
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })
// getAdminDownWork(2,3,myEvent)



//从ids获得file文件信息
///function name: 
/// ids :  Array
/// downEvent :
async function getFileByIds(ids,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let pa=[]
    ids.forEach(element => {
       pa.push(new Promise((resolve,reject)=>{
           CRUD.queryByIndex('file_table','*',element,connection,(error,results,fields)=>{
               if(error){
                    console.log(`从file_table获得id=${element}的记录失败`)
                    connection.release();
                    let {...derror}=error
                    reject(derror)
               }
               resolve(JSON.parse(JSON.stringify(results)))
           })
       }))   
    });
    Promise.all(pa).then((values)=>{
        downEvent.emit('getDown',values)
    }).catch((value)=>{
        downEvent.emit('error',value)
    })
}

async function getUserById(ids,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    CRUD.queryByIndex('user_table',['id','pwd','name','create_time','download_id','create_id','download_total','create_total'],ids,connection,(error,results,fields)=>{
        if(error){
            console.log(`获得id= ${ids}的用户信息失败`)
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))[0]
            let field=JSON.parse(JSON.stringify(fields))[0]
            downEvent.emit('getDown',result,field)
        }
    })
}


async function getAdminById(ids,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    CRUD.queryByIndex('admin_table',['id','pwd','name','create_time','work_id','work_total'],ids,connection,(error,results,fields)=>{
        if(error){
            console.log(`获得id= ${ids}的管理员信息失败`)
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))[0]
            let field=JSON.parse(JSON.stringify(fields))[0]
            downEvent.emit('getDown',result,field)
        }
    })
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     datas.forEach(data=>{
//         console.log(data)
//     })
// }).on('error',value=>{
//     console.log(value)
// })
// getFileByIds([1],myEvent)


//查找界面：
//1。按文件名来查找
async function searchFileByCapital(Capital,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    CRUD.queryBycondition('id','file_table',`where file_name_en like '${Capital}%'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            // let data=JSON.parse(JSON.stringify(rows))
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })
// searchFileByCapital("e",myEvent)



//得到所有的文件id

async function searchFile(fileName,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let cond=fileName==''?'':`where file_name='${fileName}'`
    CRUD.queryBycondition('id','file_table',cond,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })
// searchFile(myEvent)


//按文件类型
async function searchFileByType(type,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }

    CRUD.queryBycondition('id','file_table',`where file_type='${type}'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

//按关键字
async function searhFileByKey(keys,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let cond=`where find_in_set('${keys[0]}',keywords)`
    let count=1;
    while(count<keys.length){
        cond+=` and find_in_set('${keys[count]}',keywords)`
        count++;
    }
    CRUD.queryBycondition('id','file_table',cond,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

//首字母+文件类型
async function searchFileByCT(Capital,Type,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    CRUD.queryBycondition('id','file_table',`where file_type='${Type}' and file_name_en like '${Capital}%'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

//首字母+关键字
async function searchFileByCK(Capital,keys,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let cond=`where find_in_set('${keys[0]}',keywords)`
    let count=1;
    while(count<keys.length){
        cond+` and find_in_set('${keys[count]}',keywords)`
        count++;
    }
    CRUD.queryBycondition('id','file_table',`${cond} and file_name_en like '${Capital}%'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

//文件类型+关键字
async function searchFileByTK(Type,keys,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let cond=`where find_in_set('${keys[0]}',keywords)`
    let count=1;
    while(count<keys.length){
        cond+` and find_in_set('${keys[count]}',keywords)`
        count++;
    }
    CRUD.queryBycondition('id','file_table',`${cond} and file_type='${Type}'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

//首字母+关键字+文件类型
async function searchFileByCTK(Capital,Type,keys,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let cond=`where find_in_set('${keys[0]}',keywords)`
    let count=1;
    while(count<keys.length){
        cond+` and find_in_set('${keys[count]}',keywords)`
        count++;
    }
    CRUD.queryBycondition('id','file_table',`${cond} and file_type='${Type}' and file_name_en like '${Capital}%'`,connection,(error,results,fields)=>{
        if(error){
            console.error('获取文件ID失败')
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            connection.release()
            let result=JSON.parse(JSON.stringify(results))
            let field=JSON.parse(JSON.stringify(fields))
            downEvent.emit('getDown',result,field)
        }
    })
}

// let myEvent=new events.EventEmitter()
// myEvent.on('getDown',datas=>{
//     console.log(datas)
// }).on('error',value=>{
//     console.log(value)
// })

// // searchFileByType('软件',myEvent)
// // searhFileByKey(['JAVA','IDE'],myEvent)
// // searchFileByCT('E','软件',myEvent)
// // searchFileByCK('E',['JAVA'],myEvent)
// // searchFileByTK('软件',['IDE'],myEvent)
// searchFileByCTK('E','软件',['IDE'],myEvent)

module.exports={
    searchFileByCTK,
    searchFileByTK,
    getUserCreationData,
    getUserDownloadData,
    getAdminWork,
    getAdminDownWork,
    searchFileByCK,
    searchFileByCT,
    searhFileByKey,
    searchFileByType,
    searchFile,
    searchFileByCapital,
    getFileByIds,
    getUserById,
    getAdminById
}