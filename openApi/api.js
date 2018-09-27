const sign = require('../libs/getSign/getSign.js')
const base = require('../utils/util.js')
const app = getApp()
const API = "https://api.liantuofu.com/open/" //正式环境
//const API = "http://intshop.51ebill.com/open/"  //灰度环境
//const API ="http://wdtest.liantuo.com/open/"  //本地调试
const siApi = "http://shopcashiersi.liantuobank.com/ShopCashier_SI/"
const ksApi = "https://kshbank.liantuobank.com/front/baseV3/gateway.in"
const oldSi = "http://front.51ebill.com/front/baseV3/gateway.in"

function ajax(url, params, signs, method) {
    let sparams
    if (!signs) {
        let loginInfo = wx.getStorageSync("login")
        let commonparams = {
            appId: loginInfo.appId,
            random: base.randomNum(4),
            //key: loginInfo.key
            // merchantCode: loginInfo.merchantCode
        }
        sparams = Object.assign(params, commonparams)
    }
    if(params.sign){
        delete params.sign
    }
    const signparams = signs ? params : sign(sparams)
    
    console.log(`${url}==>请求参数`, signparams)
    return new Promise((res, rej) => {
        wx.request({
            url: API + url,
            data: signparams,
            method: method || 'GET',
            success: function (data) {
                console.log(`${url}==>返回数据`, data.data)
                let currPage = app.currPage()
                console.log()
                if (data.data.code == 'SUCCESS') {
                    res(data.data)
                    currPage.setData({
                        error: false
                    })
                } else if (data.data.code == 'FAILED') {
                    currPage.setData({
                        error: true,
                        isPageLoad: false,
                        errorMsg: data.data.msg
                    })
                    res(data.data)
                }
            },
            fail: function (error) {
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
function siAjax(url, params) {
    let singparams = sign(params,true)
    return new Promise((res, rej) => {
        wx.request({
            url: `${siApi}${url}`,
            data: singparams,
            success: (data) => {
                if (data.statusCode == 200) {
                    res(data.data)
                } else {
                    wx.showToast({
                        title: '网络连接失败',
                        icon: "none"
                    })
                }
            },
            fail: (error) => {
                rej(error)
            }
        })
    })
}

function oldSiAjax(params) {
   // let singparams = sign(params, "none")
    return new Promise((res, rej) => {
        wx.request({
            url: `${oldSi}`,
            data: params,
            method:'POST',
            header:{
                "content-type": "application/x-www-form-urlencoded"
            },
            success: (data) => {
                let jsonData = base.XMLtoJSON(data.data).ebill
                console.log(jsonData)
                res(jsonData)
            },
            fail: (error) => {
                rej(error)
            }
        })
    })
}

function ksAjax(params) {
    let singparams = sign(params, "ks")
    return new Promise((res, rej) => {
        wx.request({
            url: `${ksApi}`,
            data: singparams,
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: (data) => {
                let jsonData = base.XMLtoJSON(data.data).ebill
                res(jsonData)
            },
            fail: (error) => {
                rej(error)
            }
        })
    })
}
module.exports = {
    //登录
    login: params => ajax('login', params, true, "GET", ),
    //通用交易汇总统计
    trade: params => ajax('statistics/trade', params),
    //商户分组交易汇总统计
    tradeMerchant: params => ajax('statistics/trade/merchant', params),
    //员工分组交易汇总统计
    tradeOperator: params => ajax('statistics/trade/operator', params),
    //商户分组交易概要统计
    tradeSummaryMerchant: params => ajax('statistics/trade/summaryMerchant', params),
    //账单查询
    bill: params => ajax('bill', params),
    //订单查询
    payQuery: (params) => ajax('pay/query', params),
    //门店查询 /merchant/list
    merchantList: params => ajax('merchant/list', params),
    //订单退款
    refund: params => ajax('refund', params),
    //云喇叭设备绑定
    bindYunlaba: params => ajax('device/yunlaba/bind', params),

    //SI 客商提现获取transition_id列表接口
    payPlatFormInforKs: params => siAjax('withDrawal/payPlatFormInforKs.in', params),
    loginSi: params => siAjax('android/login.in', params),
    getKsWithdrawUrl: params => siAjax('withDrawal/getKsWithdrawUrl.in', params),
    ksApi: params => ksAjax(params),
    si: params => oldSiAjax(params),
}