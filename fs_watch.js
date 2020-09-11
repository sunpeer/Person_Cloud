const fs=require('fs')

function fileWatcher(cb){
    fs.watch('E:/personal_Cloud_Origin_Dir',(event,filename)=>{
        // console.log(event);
        // console.log(filename)
        if(event=="change")
            cb(filename)
    })
}

module.exports=fileWatcher
