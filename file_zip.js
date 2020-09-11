const {spawn}= require('child_process')


function zipFile(fileName){
  return new Promise((resolve,reject)=>{
    //检索.的位置：
    let dotIndex=fileName.lastIndexOf('.')
    let simpleFileName=fileName
    if(dotIndex>0)
      simpleFileName=fileName.substring(0,dotIndex)
    const re=spawn('E:/window_bat_project/zipfile.bat',[simpleFileName,fileName],{shell:true})
    re.on('exit',(code,signal)=>{
      resolve({code,signal})
    })
  })
}

module.exports=zipFile


//------------------------test----------------------
// let fileName='Git-2.28.0-64-bit.exe'
// let simpleFileName='Git-2.28.0-64-bit'
// const ls= spawn('E:/window_bat_project/zipfile.bat',[simpleFileName,fileName],{shell:true})
// ls.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });
  
// ls.stderr.on('data', (data) => {
//         console.error(`stderr: ${data}`);
//       });
    
// ls.on('error',(err)=>{
//             console.error(`error: ${err}`)
//         })
      
// ls.on('close', (code) => {
//             console.log(`child process exited with code ${code}`);
//           });




// async function test(){
//   let result=await zipFile('Git-2.28.0-64-bit.exe');
//   console.log(result)
// }

// test()