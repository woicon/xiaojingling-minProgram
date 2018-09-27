let app = getApp()
const api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
Page({
    data: {
        commonParams:{
            // 客商平台KEY：4cbf6354b6778d155399781592dd368b
            partner_id: "18042621422975713", // 客商平台PID
            core_merchant_no: "EW_N0949188211", // 客商平台编号
            input_charset: 'UTF-8',
            version: '1.0'
        }
    },
    onLoad(options) {
        let params = {
            version:'1.0',
            sign_type:'MD5',
            input_charset:'UTF-8',
            partner_id: "10036122233150929",
            transitionId: "000000000180565",
            service: 'channel_fee_query',
            operationDatetime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
            core_merchant_no: app.commonParmas("merchantCode"),
            coreMerchantCode: app.commonParmas("appId"),
            applicationName:"提现小程序",
            sign:"02E039A8FB4D7FF322CD3C7E7103E184"
        }
        api.si(params,'none').then(res=>{
            console.log(res)
            let mcDetails = JSON.parse(res.mcDetails)
            wx.setStorageSync("storeCode", mcDetails[0].platformMerchant)
            console.log(mcDetails)
           
            this.detail()  //详情获得 CA
            this.balance()  //余额查询
        })
    },
    detail(){
        let datas = {
            applicationName:'提现小程序',
            isAdmin: true,
            operationDatetime:new Date().Format('yyyy-MM-dd hh:mm:ss'),
            operatorName:'xiaochengx',
            operationLoginName:'username',
            agencyCodeName:'222',
            service: 'agent_app_store_details',
            storeCode: wx.getStorageSync("storeCode")
            // operationLoginName
            // operatorName
            // agencyCodeName
            // isAdmin:true,
        }
        let params = Object.assign(this.data.commonParams, datas)
        api.ksApi(params)
        .then(res=>{
            console.log(res)
            console.log(JSON.parse(res.mcDetails))
        })
    },
    balance(){
        let datas ={
            service:'trade_credit_account_query',
            account_no:'',
        }
        let params = Object.assign(this.data.commonParams, datas)
        api.ksApi(params)
        .then(res=>{
           console.log(res)
        })
    },
    onReady: function() {

    },

    onShow: function() {

    },

    onHide: function() {

    },
    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})