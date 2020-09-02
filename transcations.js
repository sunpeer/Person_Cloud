const CRUD=require('./CRUD')
const connectHandler=require('./mysql_con');


const test_json_for_create_transaction=require('./json_for_test/test_form_for_create_transaction.json');
const test_json_for_modify_transaction=require('./json_for_test/test_form_for_modify_transaction.json')
const test_json_for_download_transaction=require('./json_for_test/test_form_for_download_transaction.json')
const test_json_for_create_admin_transaction=require('./json_for_test/test_form_for_create_admin_transaction.json')
const test_json_for_create_user_transaction=require('./json_for_test/test_form_for_create_user_transaction.json');
const test_json_for_create_confirm_transaction=require('./json_for_test/test_form_for_create_confirm_transaction.json')


async function create_file_transcation(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }


    connection.beginTransaction( err => {
        if(err) {
            console.error('开启事务失败')
            connection.release();
            throw err 
        } else {
            let userID=data.userId;
            //往file_table表写一条文件数据
            CRUD.insertOpr("file_table",data.create_file,connection,(error,results,fields)=>{
                if(error){
                    console.error("在file_table写入'文件'数据失败")
                    connection.rollback(()=>{
                        connection.release();
                        throw error 
                    })
                }else{
                    let file_id=results.insertId
                    data.create_file_log.file_id=file_id;
                    //往日志里写一条创建文件提交的数据
                    CRUD.insertOpr("log_table",data.create_file_log,connection,(error,results,fields)=>{
                        if(error){
                            console.error("在log_table写入'创建文件提交'数据失败")
                            connection.rollback(()=>{
                                connection.release();
                                throw error;
                            })
                        }else{
                            let log_id=results.insertId
                            CRUD.updateOpr("file_table",{file_creation_history : log_id},file_id,connection,(error,results,fields)=>{
                                if(error){
                                    console.error("更新file_table file_creatinog_history失败")
                                    connection.rollback(()=>{
                                        connection.release();
                                        throw error;
                                    })
                                }else{
                                    CRUD.insertOpr("user_log_table",{last_id:data.create_file_user_log_last_id,log_id},connection,(error,results,fields)=>{
                                        if(error){
                                            console.error("在user_log_table写入'创建文件'失败")
                                            connection.rollback(()=>{
                                                connection.release();
                                                throw error;
                                            })
                                        }else{
                                            CRUD.updateOpr("user_table",{create_id:results.insertId,create_total:data.create_file_user_create_total},userID,connection,(error,results,fields)=>{
                                                if(error){
                                                    console.error("在user_log_table写入'创建文件'失败")
                                                    connection.rollback(()=>{
                                                        connection.release();
                                                        throw error;
                                                    })
                                                }else{
                                                    connection.commit(error=>{
                                                        if(error){
                                                            console.error("提交失败")
                                                            connection.rollback(()=>{
                                                                connection.release();
                                                                throw error
                                                            })
                                                        }else{
                                                            console.log('create file transcation 执行成功')
                                                            connection.release();
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

// create_file_transcation(test_json_for_create_transaction);

async function create_file_confirm_transaction(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }
    connection.beginTransaction(err=>{
        if(err) {
            console.error('开启事务失败')
            connection.release();
            throw err 
        }else{
            CRUD.insertOpr('log_table',data.confirm_create_log,connection,(error,results,fields)=>{
                if(error){
                    console.error("在log_table写入'确认创建文件'失败")
                    connection.rollback(()=>{
                        connection.release();
                        throw error;
                    })
                }else{
                    CRUD.updateOpr('file_table',data.confirm_create_file,data.file_id,connection,(error,results,fields)=>{
                        if(error){
                            console.error("确定file_table创建资料失败")
                            connection.rollback(()=>{
                                connection.release();
                                throw error;
                            })
                        }else{
                            CRUD.insertOpr('admin_log_table',{last_id:data.confirm_create_last_id,log_id:results.insertId},connection,(error,results,fields)=>{
                                if(error){
                                    console.error("在admin_log_table写入'确认创建文件'日志失败")
                                    connection.rollback(()=>{
                                        connection.release();
                                        throw error;
                                    })
                                }else{
                                    CRUD.updateOpr('admin_table',{work_id:results.insertId,work_total:data.create_confirm_admin_work_total},data.adminId,connection,(error,results,fields)=>{
                                        if(error){
                                            console.error("更新admin_table失败")
                                            connection.rollback(()=>{
                                                connection.release();
                                                throw error;
                                            })
                                        }else{
                                            connection.commit(error=>{
                                                if(error){
                                                    console.error("提交失败")
                                                    connection.rollback(()=>{
                                                        connection.release();
                                                        throw error
                                                    })
                                                }else{
                                                    console.log('confirm create transcation 执行成功')
                                                    connection.release();
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

// create_file_confirm_transaction(data)

async function modify_file_transaction(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }

    CRUD.updateOpr('file_table',data.modify,data.id,connection,(error,results,fields)=>{
        if(error){
            console.error("更新file_table资料失败")
            connection.release();
            throw error
        }else{
            console.log('modify file transcation 执行成功')
            connection.release();
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

// modify_file_transaction(test_json_for_modify_transaction)

async function download_file_transaction(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }
    connection.beginTransaction(err=>{
        if(err) {
            console.error('开启事务失败')
            connection.release();
            throw err 
        }else{
            CRUD.insertOpr('log_table',data.download_file_log,connection,(error,results,fields)=>{
                if(error){
                    console.error("在log_table写入'下载文件日志'失败")
                    connection.rollback(()=>{
                        connection.release();
                        throw error;
                    })
                }else{
                    data.download_file_file.file_download_hisotry=results.insertId
                    CRUD.updateOpr('file_table',data.download_file_file,data.file_id,connection,(error,results,fields)=>{
                        if(error){
                            console.error("在user_log_table写入'创建文件'失败")
                            connection.rollback(()=>{
                                connection.release();
                                throw error;
                            })
                        }else{
                            CRUD.insertOpr('user_log_table',{last_id:data.file_download_user_log,last_id:results.insertId},connection,(error,results,fields)=>{
                                if(error){
                                    console.error("在user_log_table写入'创建文件'失败")
                                    connection.rollback(()=>{
                                        connection.release();
                                        throw error;
                                    })
                                }else{
                                    CRUD.updateOpr('user_table',{download_id:results.insertId,download_total:data.user_download_total},data.userId,connection,(error,reslts,fields)=>{
                                        if(error){
                                            console.error("更新user_table下载历史失败")
                                            connection.rollback(()=>{
                                                connection.release();
                                                throw error;
                                            })
                                        }else{
                                            connection.commit(error=>{
                                                if(error){
                                                    console.error("提交失败")
                                                    connection.rollback(()=>{
                                                        connection.release();
                                                        throw error
                                                    })
                                                }else{
                                                    console.log('download file transcation 执行成功')
                                                    connection.release();
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

// download_file_transaction(test_json_for_download_transaction)


async function create_user_transaction(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }

    CRUD.insertOpr('user_table',data,connection,(error,results,fields)=>{
        if(error){
            console.error("在user_table crete user失败")
            connection.release();
            throw error;
        }else{
            console.log('create user transcation 执行成功')
            connection.release();
        }
    })

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


// create_user_transaction(test_json_for_create_user_transaction)

async function create_admin_transaction(data){
    let connection;
    try{
        connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败');
        throw e
    }

    CRUD.insertOpr('admin_table',data,connection,(error,results,fields)=>{
        if(error){
            console.error("在admin_table crete user失败")
            connection.release();
            throw error;
        }else{
            console.log('create admin transcation 执行成功')
            connection.release();
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

// create_admin_transaction(test_json_for_create_admin_transaction)