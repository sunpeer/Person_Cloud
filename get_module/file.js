const getData=require('../getdata')
const query=require('../query')

module.exports=async (req,res)=>{
    let ids=req.query.ids||''
    try{
        //如果query的ids为undefined,那么返回所有文件的id
        if(ids==''){
            let result=await getData(query.searchFile)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            let ids=[]
            result.foreach((item)=>{
                ids.push(item.id)
            })
            res.send({result:'OK',data:{ids}})
        }else{//否则返回文件信息
            ids=ids.split(',')
            let result=await getData(ids,query.getFileByIds)
            console.log('[OK]',decodeURIComponent(req.originalUrl))
            let data=[]
            result.foreach((item)=>{
                data.push({
                    id:item.id,
                    file_name:item.file_name,
                    file_type:item.file_type,
                    is_available:item.is_available,
                    size:item.size,
                    keywords:item.keywords,
                    state:item.state,
                    file_desc:item.file_desc,
                    file_owner:file_owner,
                    file_creation_history:item.file_creation_history,
                    file_download_history:item.file_download_history,
                    download_total:item.download_total
                })
            })
            res.send({result:'OK',data:{files:data}})
        }
    }catch(error){
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}