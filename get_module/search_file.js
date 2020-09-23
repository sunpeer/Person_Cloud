const getData=require('../getdata')
const query=require('../query')
const { searchFileByCTK } = require('../query')
const getdata = require('../getdata')

module.exports=async (req,res)=>{
    //这里会有这么几种组合：
    //type+captial
    //type
    //type+keyword
    //type+keyword+capital
    //capital+keyword
    //capital
    //keyword
    //这个不会
    //type='type1',capital='A',keyword=['keyword1','keyword2',...]'
    try{
        let result=[]
        if(req.query.type!=undefined&&req.query.capital==undefined&&req.query.keyword===undefined){
            result=await getData(req.query.type,query.searchFileByType)
        }else if(req.query.type!=undefined&&req.query.capital!==undefined&&req.query.keyword===undefined){
            result= await getData(req.query.capital,req.query.type,query.searchFileByCT)
        }else if(req.query.type!=undefined&&req.query.capital!==undefined&&req.query.keyword!==undefined){
            result=await getData(req.query.capital,req.quey.type,req.query.keyword,searchFileByCTK)
        }else if(req.query.type!=undefined&&req.query.capital===undefined&&req.query.keyword!==undefined){
            result =await getData(req.query.type,req.query.keyword,query.searchFileByTK)
        }else if(req.query.type===undefined&&req.query.keyword!==undefined&&req.query.capital!==undefined){
            result =await getData(req.query.capital,req.query.keyword,query.searchFileByCK)
        }else if(req.query.type===undefined&&req.query.keyword===undefined&&req.query.capital!==undefined){
            result=await getdata(req.query.capital,query.searchFileByCapital)
        }else if(req.query.type===undefined&&req.query.keyword!==undefined&&req.query.capital===undefined){
            result=await getdata(req.query.keyword,query.searhFileByKey)
        }else{
            //没有一个条件
            result=await getData('',query.searchFile)
        }
        console.log('[OK]',decodeURIComponent(req.originalUrl))
        let ids=[]
        result.forEach((item)=>{
            ids.push(item.id)
        })
        res.send({result:'OK',data:{ids}})
    }catch(error){
        console.log('[ERR]', decodeURIComponent(req.originalUrl),error)
        res.status(500).send({result:'NG'})
    }
}