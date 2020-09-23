const getData=require('../getdata')
const query=require('../query')

module.exports=async (req,res)=>{
    let ids=req.query.ids||''
    try{
        //如果query的ids为undefined,那么返回所有文件的id
        if(ids==''){
            let result=await getData('',query.searchFile)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            let ids=[]
            result.forEach((item)=>{
                ids.push(item.id)
            })
            res.send({result:'OK',data:{ids}})
        }else{//否则返回文件信息
            ids=ids.split(',')
            let result=await getData(ids,query.getFileByIds)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            let data=[]
            result.forEach((item)=>{
                data.push({
                    id:item[0].id,
                    file_name:item[0].file_name,
                    file_type:item[0].file_type,
                    is_available:item[0].is_available,
                    size:item[0].size,
                    keywords:item[0].keywords,
                    state:item[0].state,
                    file_desc:item[0].file_desc,
                    file_owner:item[0].file_owner,
                    file_creation_history:item[0].file_creation_history,
                    file_download_history:item[0].file_download_history,
                    download_total:item[0].download_total
                })
            })
            res.send({result:'OK',data:{files:data}})
        }
    }catch(error){
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}