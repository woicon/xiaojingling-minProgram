const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(),      //日
        "h+": this.getHours(),     //小时
        "m+": this.getMinutes(),   //分
        "s+": this.getSeconds(),   //秒 //季度
        "q+": Math.floor((this.getMonth() + 3) / 3),    
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
}
//格式化开始时间
let startDate = (num, format) => {
    let dayValue = 24 * 60 * 60 * 1000
    return new Date(new Date().getTime() - dayValue * num).Format(format)
}
function strDateFormat(str) {
    return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
}

function batFormatDate(list,attr){
    for (let i in list) {
        if (list[i][attr]) {
            list[i][attr] = new Date(list[i][attr]).Format('yyyy-MM-dd')
        }
    }
}
function formatDate(dates, types) {
    return new Date(dates || '').Format(types)
}
//随机获取五位数
function randomNum(num) {
    let rand = [];
    for (let i = 0; i <= num; i++) {
        rand.push(Math.floor(Math.random() * 10))
    }
    return rand.join('')
}
var xmlToJSON = require('../libs/xmlToJSON/xmlToJSON.js')
//XML转JSON /(ㄒoㄒ)/
function XMLtoJSON(xml) {
    var myOptions = {
        normalize: false,
        mergeCDATA: false,
        xmlns: true,
        grokText: false,
        textKey: false,
        grokAttr: false,
        childrenAsArray: false,
        stripAttrPrefix: false,
        stripElemPrefix: false,
        normalize: false,
        attrsAsObject: false
    }
    return xmlToJSON.xmlToJSON.parseString(xml, myOptions);
}
module.exports = {
    formatTime,
    formatDate,
    dayValue: 24 * 60 * 60 * 1000,
    startDate,
    strDateFormat,
    randomNum,
    batFormatDate,
    XMLtoJSON
}