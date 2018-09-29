let app = getApp()
const api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
const commonParams = {
    // 客商平台KEY：4cbf6354b6778d155399781592dd368b
    //fund_pool_no：PN01000000000000001 
    partner_id: "18042621422975713", // 客商平台PID
    core_merchant_no: "EW_N0949188211", // 客商平台编号
    input_charset: 'UTF-8',
    version: '1.0'
}
Page({
    data: {
        isPageLoad:true,
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
            let mcDetails = JSON.parse(res.mcDetails)
            wx.setStorageSync("storeCode", mcDetails[0].platformMerchant)
            console.log("SI == McDetails=====+>",mcDetails)
            this.detail()  //详情获得 CA
          
        })
        this.initDate()
    },
    detail(){
        //提现费率详情 需要获得 certificateNo  accountType
        let datas = {
            applicationName:'提现小程序',
            isAdmin: true,
            operationDatetime:new Date().Format('yyyy-MM-dd hh:mm:ss'),
            operatorName:'xiaochengx',
            operationLoginName:'username',
            agencyCodeName:'222',
            service: 'agent_app_store_details',
            storeCode: wx.getStorageSync("storeCode"),
            merchantPaymentMode:1
        }
        const params = Object.assign(datas, commonParams )
        api.ksApi(params)
            .then(res=>{
                console.log("MCdetails=====>",JSON.parse(res.mcDetails))
                let mcDetails = JSON.parse(res.mcDetails)
                wx.setStorageSync('mcdetail',{
                    certificateNo: mcDetails.certificateNo,
                    accountType: mcDetails.accountType,
                    caAccount: mcDetails.caAccount
                })

                this.balance()  //余额查询
            })
    },
    balance(){
        //余额查询
        let ca  = wx.getStorageSync("mcdetail")
        let params ={
            service:'trade_credit_account_query',
            account_no: ca.caAccount,
        }
        api.ksApi(Object.assign(params,commonParams))
        .then(res=>{
            console.log("balance=====>",JSON.parse(res.tradeDetails))
            let tradeDetails = JSON.parse(res.tradeDetails)
            this.getExchangList()
            this.setData({
                trade: tradeDetails[0],
                isPageLoad:false
            })
        })
    },
    getExchangList(){
        let ca = wx.getStorageSync("mcdetail")
        let params = {
            withdraw_account_no: ca.caAccount,
            service: 'trade_single_withdraw_remittance_page_details',
            fund_pool_no:"PN01000000000000001", 
            gmt_created_start:"2018-06-01 15:03:20",
            gmt_created_end:"2018-06-30 15:03:20",
        }
        api.ksApi(Object.assign(params, commonParams))
        .then(res=>{
            console.log(res)
        })
    },
    initDate(){
        let nowDate = new Date()
        let tadayDate = nowDate.Format("yyyy-MM-dd"),
            startDate = new Date(nowDate.setDate(nowDate.getDate() - 31)).Format("yyyy-MM-dd"),
            start = new Date(nowDate.setDate(nowDate.getDate() - 1000)).Format("yyyy-MM-dd");
        console.log(tadayDate, startDate)
        this.setData({
            tadayDate: tadayDate,
            endDate: tadayDate,
            startDate: startDate,
            start: start
        })
    },
    onReady: function() {

    },

    onShow: function() {

    },
})