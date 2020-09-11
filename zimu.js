const pinyin=require('pinyin')


module.exports=function getzimu(hanzi)
{
    let tune=pinyin(hanzi,{style:pinyin.STYLE_NORMAL})
    let py=''
    tune.forEach((item)=>{
        py+=item[0]
    })
    return py
}