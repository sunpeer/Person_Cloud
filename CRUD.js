function insertOpr(table_name,key_values,connection,cb){
    connection.query(`insert into ${table_name} set ?`,key_values,cb)
}

function updateOpr(table_name,key_values,index,connection,cb){
    connection.query(`update ${table_name} set ? where id=${index}`,key_values,cb)
}

function queryByIndex(table_name,query_key,index,connection,cb){
    connection.query(`select ? from ${table_name} where id=${index}`,query_key,cb)
}

function queryBycondition(data,table_name,condition,connection,cb){
    connection.query(`select ${data} from ${table_name} ${condition}`,cb) 
}


module.exports={
    insertOpr,
    updateOpr,
    queryByIndex,
    queryBycondition
}
