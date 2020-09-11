// function getNowFormatDate() {
//     var date = new Date();
//     var seperator1 = "-";
//     var seperator2 = ":";
//     var month = date.getMonth() + 1;
//     var strDate = date.getDate();
//     if (month >= 1 && month <= 9) {
//         month = "0" + month;
//     }
//     if (strDate >= 0 && strDate <= 9) {
//         strDate = "0" + strDate;
//     }
//     var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
//     return currentdate;
// }


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

// function getYMDHMS (timestamp) {
//     let time = new Date(timestamp)
//     let year = time.getFullYear()
//     const month = (time.getMonth() + 1).toString().padStart(2, '0')
//     const date = (time.getDate()).toString().padStart(2, '0')
//     const hours = (time.getHours()).toString().padStart(2, '0')
//     const minute = (time.getMinutes()).toString().padStart(2, '0')
//     const second = (time.getSeconds()).toString().padStart(2, '0')

//     return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
//   }



// console.log(getNowFormatDate(Date.now()))
module.exports=getNowFormatDate