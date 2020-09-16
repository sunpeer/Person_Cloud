const events=require('events');

module.exports=function getData(){
    let arg=arguments;
    let arg_len=arguments.length;
    return new Promise(
        (resolve,reject)=>{
            let myEvent=new events.EventEmitter();
            myEvent.on('getDown',(result,field)=>{
                resolve(result)
            })
            myEvent.on('error',error=>{
                reject(error)
            })
            // query(data,myEvent)//js如何做到动态参数
            if(arg_len==1)
            arg[0](myEvent)
            else if(arg_len==2)
            arg[1](arg[0],myEvent)
            else if(arg_len==3)
            arg[2](arg[0],arg[1],myEvent)
            else if(arg_len==4)
            arg[3](arg[0],arg[1],arg[2],myEvent)
        }
    )
}