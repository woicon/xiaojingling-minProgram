//MD5
var md5 = require('../../libs/md5/md5.min.js')
//对象排序
function sortObj(obj) {
    var arr = []
    for (var i in obj) {
        arr.push([i, obj[i]])
    };
    arr.sort()
    var len = arr.length,
        obj = {}
    for (var i = 0; i < len; i++) {
        obj[arr[i][0]] = arr[i][1]
    }
    return obj
}
//转URL参数
function parseParam(obj, encode) {
    function toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key
        }
        if (encode) {
            return key + '=' + encodeURIComponent(value === null ? '' : String(value));
        } else {
            return key + '=' + (value === null ? '' : String(value));
        }
    }
    var ret = []
    for (var key in obj) {
        key = encode ? encodeURIComponent(key) : key;
        var values = obj[key]
        if (values && values.constructor == Array) {
            //数组
            var queryValues = []
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value))
            }
            ret = ret.concat(queryValues)
            console.log(ret)
        } else { //字符串
            ret.push(toQueryPair(key, values))
        }
    }
    return ret.join('&')
}
module.exports = (params, isSi, key) => {
    if (params.sign) {
        delete params.sign
    }
    let loginInfo = wx.getStorageSync("login")
    if (isSi === true) {
        //SI验签
        console.log(sortObj(params))
        let singparams = `${parseParam(sortObj(params))}&${wx.getStorageSync("siKey")}`
        console.log(singparams)
        let MD5 = md5(singparams).toUpperCase()
        let MD5_array = MD5.split('')
        let convertMD5 = chars => {
            return String.fromCharCode(chars.charCodeAt() ^ 't'.charCodeAt())
        }
        params.sign = MD5_array.map(convertMD5).join('')
        console.log(params.sign)
        return params
    } else if (isSi === 'none') {
        //免验签
        let singparams = `${parseParam(sortObj(params))}`
        let sign = md5(singparams).toUpperCase()
        params.sign = sign
        return params
    } else if (isSi === 'ks') {
        //客商验签
        let keys = key || '4cbf6354b6778d155399781592dd368b'
        console.log(keys)
        let singparams = `${parseParam(sortObj(params))}${keys}`
        let sign = md5(singparams)
        params.sign = sign
        params.sign_type = 'MD5'
        return params
    } else {
        //liantuofu.com 接口验签
        let singparams = `${parseParam(sortObj(params))}&key=${loginInfo.key}`
        params.sign = md5(singparams)
        return params
    }

}

// pool_no: PN01000000000000213
// core_merchant_no: KS_N1453170986
// pid: 18110120453815253
// key: 519e220dc1cc6ab517ffff60b59a8d51