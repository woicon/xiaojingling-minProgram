const sign = require('../libs/getSign/getSign.js')
const app = getApp()
const API = "https://api.liantuofu.com/open/" //正式环境
//const API = "http://intshop.51ebill.com/open/"  //灰度环境
//const API ="http://wdtest.liantuo.com/open/"  //本地调试

function ajax(url, parmas, signs, method) {
    let sParmas
    if (!signs){
        let loginInfo = wx.getStorageSync("login")
        let commonParmas = {
            appId:loginInfo.appId,
            random: randomNum(4),
            //key: loginInfo.key
           // merchantCode: loginInfo.merchantCode
        }
        sParmas = Object.assign(parmas, commonParmas)
    }
    console.log(`${url}==>请求参数`,sParmas)
    const signParmas = signs ? parmas : sign(sParmas)
    return new Promise((res, rej) => {
        wx.request({
            url: API + url,
            data: signParmas,
            method: method || 'GET',
            success: function(data) {
                console.log(`${url}==>返回数据`,data.data)
                let currPage = app.currPage()
                if(data.data.code == 'SUCCESS'){
                    res(data.data)
                    currPage.setData({
                        error:false
                    })
                }else if(data.data.code == 'FAILED'){
                    // wx.showToast({
                    //     title: data.data.msg || data.data.subMsg,
                    //     icon:"none"
                    // })
                    currPage.setData({
                        error:true,
                        isPageLoad:false,
                        errorMsg: data.data.msg
                    })
                    res(data.data)
                }
            },
            fail: function(error) {
                rej(error)
            }
        })
    }).catch(err => {
        console.log(err)
        wx.showModal({
            title: 'ERROR',
            content: JSON.stringify(err.errMsg),
        })
    })
}
//随机获取五位数
function randomNum(num) {
    let rand = [];
    for (let i = 0; i <= num; i++) {
        rand.push(Math.floor(Math.random() * 10))
    }
    return rand.join('')
}
module.exports = {
    //登录
    login: parmas => ajax('login', parmas, true, "GET", ),
    //通用交易汇总统计
    trade: parmas => ajax('/statistics/trade', parmas),
    //商户分组交易汇总统计
    tradeMerchant: parmas => ajax('statistics/trade/merchant', parmas),
    //员工分组交易汇总统计
    tradeOperator: parmas => ajax('statistics/trade/operator', parmas),
    //商户分组交易概要统计
    tradeSummaryMerchant: parmas => ajax('statistics/trade/summaryMerchant', parmas),
    //账单查询
    bill:parmas => ajax('bill', parmas),
    //订单查询
    payQuery: (parmas) => ajax('pay/query', parmas),
    //门店查询 /merchant/list
    merchantList: parmas => ajax('merchant/list', parmas)
}