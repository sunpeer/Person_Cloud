const CRUD=require('./CRUD')
const connectHandler=require('./mysql_con');
const events=require('events')

// const test_json_for_create_transaction=require('./json_for_test/test_form_for_create_transaction.json');
// const test_json_for_modify_transaction=require('./json_for_test/test_form_for_modify_transaction.json')
// const test_json_for_download_transaction=require('./json_for_test/test_form_for_download_transaction.json')
// const test_json_for_create_admin_transaction=require('./json_for_test/test_form_for_create_admin_transaction.json')
// const test_json_for_create_user_transaction=require('./json_for_test/test_form_for_create_user_transaction.json');
// const test_json_for_create_confirm_transaction=require('./json_for_test/test_form_for_create_confirm_transaction.json')

async function create_file_transcation(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }


    connection.beginTransaction( err => {
        if(err) {
            console.error('开启事务失败')
            connection.release()
            let {...eValue}=err
            downEvent.emit('error',eValue)
            return
        } else {
            let userID=data.userId;
            //往file_table表写一条文件数据
            CRUD.insertOpr("file_table",data.create_file,connection,(error,results,fields)=>{
                if(error){
                    console.error("在file_table写入'文件'数据失败")
                    connection.rollback(()=>{
                        connection.release()
                        let {...eValue}=error
                        downEvent.emit('error',eValue)
                        return
                    })
                }else{
                    let file_id=results.insertId
                    data.create_file_log.file_id=file_id;
                    //往日志里写一条创建文件提交的数据
                    CRUD.insertOpr("log_table",data.create_file_log,connection,(error,results,fields)=>{
                        if(error){
                            console.error("在log_table写入'创建文件提交'数据失败")
                            connection.rollback(()=>{
                                connection.release()
                                let {...eValue}=error
                                downEvent.emit('error',eValue)
                                return
                            })
                        }else{
                            let log_id=results.insertId
                            CRUD.updateOpr("file_table",{file_creation_history : log_id},file_id,connection,(error,results,fields)=>{
                                if(error){
                                    console.error("更新file_table file_creatinog_history失败")
                                    connection.rollback(()=>{
                                        connection.release()
                                        let {...eValue}=error
                                        downEvent.emit('error',eValue)
                                        return
                                    })
                                }else{
                                    CRUD.insertOpr("user_log_table",{last_id:data.create_file_user_log_last_id,log_id},connection,(error,results,fields)=>{
                                        if(error){
                                            console.error("在user_log_table写入'创建文件'失败")
                                            connection.rollback(()=>{
                                                connection.release()
                                                let {...eValue}=error
                                                downEvent.emit('error',eValue)
                                                return
                                            })
                                        }else{
                                            CRUD.updateOpr("user_table",{create_id:results.insertId,create_total:parseInt(data.create_file_user_create_total)+1},userID,connection,(error,results,fields)=>{
                                                if(error){
                                                    console.error("在user_log_table写入'创建文件'失败")
                                                    connection.rollback(()=>{
                                                        connection.release()
                                                        let {...eValue}=error
                                                        downEvent.emit('error',eValue)
                                                        return
                                                    })
                                                }else{
                                                    connection.commit(error=>{
                                                        if(error){
                                                            console.error("提交失败")
                                                            connection.rollback(()=>{
                                                                connection.release()
                                                                let {...eValue}=error
                                                                downEvent.emit('error',eValue)
                                                                return
                                                            })
                                                        }else{
                                                            connection.release();
                                                            let {...result}=results;
                                                            downEvent.emit('getDown',result,fields)
                                                        }
                                                    })
                                                }

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })


            // console.log('statement after insertOpr 1')
            // CRUD.insertOpr('test_table',{name:26},connection,(error,results,fields)=>{
            //     console.log('insert 2 executed')
            // })
            // console.log('statement after insertOpr 2')

            // connection.commit(function(err) {
            //     if (err) {
            //       return connection.rollback(function() {
            //         throw err;
            //       });
            //     }
            //     console.log('success!');
            //     connection.release()
            //   });


        }
    })
}

// let myEvent=new events.EventEmitter();
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(result,field)=>{
//     console.log(result,field)
// })
// create_file_transcation(test_json_for_create_transaction,myEvent);

async function create_file_confirm_transaction(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    connection.beginTransaction(err=>{
        if(err) {
            console.error('开启事务失败')
            connection.release()
            let {...eValue}=err
            downEvent.emit('error',eValue)
            return
        }else{
            CRUD.insertOpr('log_table',data.confirm_create_log,connection,(error,results,fields)=>{
                if(error){
                    console.error("在log_table写入'确认创建文件'失败")
                    connection.rollback(()=>{
                        connection.release()
                        let {...eValue}=error
                        downEvent.emit('error',eValue)
                        return
                    })
                }else{
                    data.confirm_create_file.file_creation_history=results.insertId;
                    CRUD.updateOpr('file_table',data.confirm_create_file,data.file_id,connection,(error,results,fields)=>{
                        if(error){
                            console.error("确定file_table创建资料失败")
                            connection.rollback(()=>{
                                connection.release()
                                let {...eValue}=error
                                downEvent.emit('error',eValue)
                                return
                            })
                        }else{
                            CRUD.insertOpr('admin_log_table',{last_id:data.confirm_create_last_id,log_id:data.confirm_create_file.file_creation_history},connection,(error,results,fields)=>{
                                if(error){
                                    console.error("在admin_log_table写入'确认创建文件'日志失败")
                                    connection.rollback(()=>{
                                        connection.release()
                                        let {...eValue}=error
                                        downEvent.emit('error',eValue)
                                        return
                                    })
                                }else{
                                    CRUD.updateOpr('admin_table',{work_id:results.insertId,work_total:parseInt(data.create_confirm_admin_work_total)+1},data.adminId,connection,(error,results,fields)=>{
                                        if(error){
                                            console.error("更新admin_table失败")
                                            connection.rollback(()=>{
                                                connection.release()
                                                let {...eValue}=error
                                                downEvent.emit('error',eValue)
                                                return
                                            })
                                        }else{
                                            connection.commit(error=>{
                                                if(error){
                                                    console.error("提交失败")
                                                    connection.rollback(()=>{
                                                        connection.release()
                                                        let {...eValue}=error
                                                        downEvent.emit('error',eValue)
                                                        return
                                                    })
                                                }else{
                                                    console.log('confirm create transcation 执行成功')
                                                    connection.release();
                                                    let {...result}=results;
                                                    downEvent.emit('getDown',result,fields)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}


// let myEvent=new events.EventEmitter();
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(result,field)=>{
//     console.log(result,field)
// })
// create_file_confirm_transaction(test_json_for_create_confirm_transaction,myEvent)

async function modify_file_transaction(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }

    CRUD.updateOpr('file_table',data.modify,data.id,connection,(error,results,fields)=>{
        if(error){
            console.error("更新file_table资料失败")
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            console.log('modify file transcation 执行成功')
            connection.release();
            let {...result}=results;
            downEvent.emit('getDown',result,fields)
        }
    })

    // connection.beginTransaction(err=>{
    //     if(err) {
    //         console.error('开启事务失败')
    //         connection.release();
    //         throw err 
    //     }else{
    //         CRUD.updateOpr('file_table',data.modify,data.id,connection,(error,results,fields)=>{
    //             if(error){
    //                 console.error("更新file_table资料失败")
    //                 connection.rollback(()=>{
    //                     connection.release();
    //                     throw error 
    //                 })
    //             }else{
    //                 connection.commit(error=>{
    //                     if(error){
    //                         console.error("提交失败")
    //                         connection.rollback(()=>{
    //                             connection.release();
    //                             throw error
    //                         })
    //                     }else{
    //                         console.log('modify file transcation 执行成功')
    //                         connection.release();
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
}


// let myEvent=new events.EventEmitter();
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(result,field)=>{
//     console.log(result,field)
// })
// modify_file_transaction(test_json_for_modify_transaction,myEvent)

async function download_file_transaction(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    connection.beginTransaction(err=>{
        if(err) {
            console.error('开启事务失败')
            connection.release()
            let {...eValue}=err
            downEvent.emit('error',eValue)
            return
        }else{
            CRUD.insertOpr('log_table',data.download_file_log,connection,(error,results,fields)=>{
                if(error){
                    console.error("在log_table写入'下载文件日志'失败")
                    connection.rollback(()=>{
                        connection.release()
                        let {...eValue}=error
                        downEvent.emit('error',eValue)
                        return
                    })
                }else{
                    let log_id=results.insertId
                    CRUD.updateOpr('file_table',{file_download_history:results.insertId,download_total:parseInt(data.download_file_download_total)+1},data.file_id,connection,(error,results,fields)=>{
                        if(error){
                            console.error("在file_table更新下载失败")
                            connection.rollback(()=>{
                                connection.release()
                                let {...eValue}=error  
                                downEvent.emit('error',eValue)
                                return
                            })
                        }else{
                            CRUD.insertOpr('user_log_table',{last_id:data.file_download_user_log,log_id:log_id},connection,(error,results,fields)=>{
                                if(error){
                                    console.error("在user_log_table写入'创建文件'失败")
                                    connection.rollback(()=>{
                                        connection.release()
                                        let {...eValue}=error
                                        downEvent.emit('error',eValue)
                                        return
                                    })
                                }else{
                                    CRUD.updateOpr('user_table',{download_id:results.insertId,download_total:parseInt(data.user_download_total)+1},data.user_id,connection,(error,reslts,fields)=>{
                                        if(error){
                                            console.error("更新user_table下载历史失败")
                                            connection.rollback(()=>{
                                                connection.release()
                                                let {...eValue}=error
                                                downEvent.emit('error',eValue)
                                                return
                                            })
                                        }else{
                                            connection.commit(error=>{
                                                if(error){
                                                    console.error("提交失败")
                                                    connection.rollback(()=>{
                                                        connection.release()
                                                        let {...eValue}=error
                                                        downEvent.emit('error',eValue)
                                                        return
                                                    })
                                                }else{
                                                    console.log('download file transcation 执行成功')
                                                    connection.release();
                                                    let {...result}=results;
                                                    downEvent.emit('getDown',result,fields)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}


// let myEvent=new events.EventEmitter();
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(result,field)=>{
//     console.log(result,field)
// })
// download_file_transaction(test_json_for_download_transaction,myEvent)

async function create_user_transaction(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }
    let condition=''
    switch(data.group)
    {
        case 'roomate':
            condition=`where id >= 000000 and id < 010000`
            break;
        case 'home':
            condition='where id >= 010000 and id < 020000'
            break;
    }
    CRUD.queryBycondition('max(id) as id','user_table',condition,connection,(error,results,fields)=>{
        if(error){
            console.error("获取当前该组最大id失败")
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
        }else{
            let maxId=JSON.parse(JSON.stringify(results))[0].id
            //当这个区间没有创建出用户，获得的maxId是Null
            if(maxId===null){
                switch(data.group)
                {
                    case 'roomate':
                        maxId=1
                        break;
                    case 'home':
                        maxId=10000
                        break;
                }
            }else{
                maxId++;
            }
            data.insertData.id=maxId;
            // console.log(maxId)
            CRUD.insertOpr('user_table',data.insertData,connection,(error,results,fields)=>{
                if(error){
                    console.error("在user_table crete user失败")
                    connection.release()
                    let {...eValue}=error
                    downEvent.emit('error',eValue)
                    return
                }else{
                    console.log('create user transcation 执行成功')
                    connection.release();
                    let {...result}=results;
                    downEvent.emit('getDown',result)
                }
            })
        }
    })

    // CRUD.insertOpr('user_table',data,connection,(error,results,fields)=>{
    //     if(error){
    //         console.error("在user_table crete user失败")
    //         connection.release();
    //         throw error;
    //     }else{
    //         console.log('create user transcation 执行成功')
    //         connection.release();
    //     }
    // })

    // connection.beginTransaction(err=>{
    //     if(err) {
    //         console.error('开启事务失败')
    //         connection.release();
    //         throw err 
    //     }else{
    //         CRUD.insertOpr('user_table',data,connection,(error,results,fields)=>{
    //             if(error){
    //                 console.error("在user_table crete user失败")
    //                 connection.rollback(()=>{
    //                     connection.release();
    //                     throw error;
    //                 })
    //             }else{
    //                 connection.commit(error=>{
    //                     if(error){
    //                         console.error("提交失败")
    //                         connection.rollback(()=>{
    //                             connection.release();
    //                             throw error
    //                         })
    //                     }else{
    //                         console.log('create user transcation 执行成功')
    //                         connection.release();
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
}

// let myEvent=new events.EventEmitter();
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(result,field)=>{
//     console.log(result,field)
// })
// create_user_transaction(test_json_for_create_user_transaction,myEvent)

async function create_admin_transaction(data,downEvent){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        let {...eValue}=e
        downEvent.emit('error',eValue)
        return
    }

    CRUD.insertOpr('admin_table',data,connection,(error,results,fields)=>{
        if(error){
            console.error("在admin_table crete user失败")
            connection.release()
            let {...eValue}=error
            downEvent.emit('error',eValue)
            return
            // console.log(Object.keys(error))
            // let {code,errno,sqlMessage,sqlState,index,sql}=error;
            // let {...errorData}=error
            // let valueError={code,errno,sqlMessage,sqlState,index,sql}
            // let valueError={errorData}
            // downEvent.emit('error',errorData)
        }else{
            console.log('create admin transcation 执行成功')
            connection.release();
            let {...result}=results;
            // let {...field}=fields;
            downEvent.emit('getDown',result)
        }
    })
 
    // connection.beginTransaction(err=>{
    //     if(err) {
    //         console.error('开启事务失败')
    //         connection.release();
    //         throw err 
    //     }else{
    //         CRUD.insertOpr('admin_table',data,connection,(error,results,fields)=>{
    //             if(error){
    //                 console.error("在admin_table crete user失败")
    //                 connection.rollback(()=>{
    //                     connection.release();
    //                     throw error;
    //                 })
    //             }else{
    //                 connection.commit(error=>{
    //                     if(error){
    //                         console.error("提交失败")
    //                         connection.rollback(()=>{
    //                             connection.release();
    //                             throw error
    //                         })
    //                     }else{
    //                         console.log('create admin transcation 执行成功')
    //                         connection.release();
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
}

// myEvent=new events.EventEmitter()
// myEvent.on('error',value=>{
//     console.log(value)
// }).on('getDown',(results,fields)=>{
//     // console.log(Object.keys(results),'\n')
//     //fileds: undefined
//     console.log(results,fields)
// })
// create_admin_transaction(test_json_for_create_admin_transaction,myEvent)

module.exports={
    create_file_transcation,
    create_file_confirm_transaction,
    modify_file_transaction,
    download_file_transaction,
    create_user_transaction,
    create_admin_transaction
}