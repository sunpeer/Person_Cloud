
const connectHandler=require('./mysql_con')

insertHandler = async (json_vals) => {
    try{
        const connection = await connectHandler() // 得到链接
    }catch(e){
        console.error('连接数据库失败:');
        console.error(e.stack)
        return ;
    }
    const tablename = 'test_table' //动态table(表)名称
    //开启事务
    connection.beginTransaction( err => {
      if(err) {
        return '开启事务失败'
      } else {
         //执行INSERT插入操作
        connection.query(`INSERT INTO ${tablename} SET id = ?`, vals, (e, rows, fields) => {
          if(e) {
            return connection.rollback(() => {
                console.log(e)
              console.log('插入失败数据回滚')
            })
          } else {
            connection.commit((error) => {
              if(error) {
                console.log('事务提交失败')
              }else{
                  console.log('事务提交成功')
              }
            })
            connection.release()  // 释放链接
            return {rows, success: true}  // 返回数据库操作结果这里数据格式可根据个人或团队规范来定制
          }
        })
      }
    })
  }

  insertHandler([2])