const test_json=require('./json_for_test/test_form_for_create_transaction.json');
const querystring=require('querystring')
// console.log(test_js)
// console.log(test_js.create_file)
// console.dir(test_js)




let create_desc={
    file_name: 'wps',
    file_type: '软件',
    size: '20.23',
    origin_size: '30.23',
    keywords: '办公',
    file_path: 'E:/personal_Cloud_Dir/wps',
    "file_desc" : ""
}

// let create_desc={
//     file_name: 'wps',
//     file_type: '软件',
//     size: '20.23',
//     origin_size: '30.23',
//     keywords: '办公',
//     file_path: 'E:/personal_Cloud_Dir/wps',
//     file_desc : "一款国产自动化办公软件"
// }


let origin=create_desc;
console.log("origin date: ",origin)
let after_stringify=querystring.stringify(origin)
console.log("after stringify: ",after_stringify)
let after_parse=querystring.parse(after_stringify)
console.log("after parse: ",after_parse)


