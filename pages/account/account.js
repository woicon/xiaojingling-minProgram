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
        status:{
            '01':'扣减成功',
            '02':'提现成功',
            '03':'提现失败'
        }
    },
    onLoad(options) {
        let params = {
            version: '1.0',
            input_charset: 'UTF-8',
            partner_id: "10036122233150929",
            transitionId: options.id,
            sign_type: 'MD5',
            service: 'channel_fee_query',
            operationDatetime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
            core_merchant_no: app.commonParams("merchantCode"),
            coreMerchantCode: app.commonParams("appId"),
            applicationName: "提现小程序",
        }
        api.si(params, 'none').then(res => {
            let mcDetails = JSON.parse(res.mcDetails)
            console.log(mcDetails)
            wx.setStorageSync("storeCode", mcDetails[0].platformMerchant)
            console.log("SI == McDetails == ", mcDetails)
            this.detail()  //详情获得 CA
        })
        this.initDate()
    },
    
    setDate(arr){
        return arr.map((item,index,arr)=>{
            for(let i in item){
                if(i.indexOf('gmt') != -1){
                    item[i] = new Date(item[i]).Format('yyyy-MM-dd hh:mm:ss')
                }
            }
            return item
        })
    },
    detail(){
        //提现费率详情 需要获得 certificateNo  accountType
        let datas = {
            applicationName:'提现小程序',
          //  isAdmin: true,
            operationDatetime:new Date().Format('yyyy-MM-dd hh:mm:ss'),
          //  operatorName:'xiaochengxu',
         //   operationLoginName:'username',
          //  agencyCodeName:'222',
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
                wx.setStorageSync('storeDetail', mcDetails)
                this.balance()  //余额查询
            })
    },
    balance(){ 
        //余额查询
        let ca  = wx.getStorageSync("mcdetail")
        let params ={
            service:'trade_credit_account_query',
            account_no: ca.caAccount,
            //fund_pool_no:
        }
        api.ksApi(Object.assign(params,commonParams))
        .then(res=>{
            console.log("余额查询=====>",JSON.parse(res.tradeDetails))
            let tradeDetails = JSON.parse(res.tradeDetails)
            this.getExchangList()
            this.setData({
                balance: tradeDetails[0],
                isPageLoad:false
            })
        })
    },
    toDetail(e){
        let id = e.currentTarget.dataset.id
        wx.setStorageSync('tradeDetail',this.data.trade[id])
        wx.navigateTo({
            url: '/pages/tradeDetail/tradeDetail',
        })
    },
    getExchangList(){
        let ca = wx.getStorageSync("mcdetail")
        let params = {
            withdraw_account_no: ca.caAccount,
            service: 'trade_single_withdraw_remittance_page_details',
            fund_pool_no:"PN01000000000000001", //客商资金池编号
            gmt_created_start:"2018-12-01 15:03:20",
            gmt_created_end:"2018-12-30 15:03:20",
        }
        api.ksApi(Object.assign(params, commonParams))
        .then(res=>{
            console.log(res)
            this.setData({
                trade: this.setDate(JSON.parse(res.tradeDetails))
            })
        })
    },
    initDate(){
        let nowDate = new Date()
        let tadayDate = nowDate.Format("yyyy-MM-dd"),
            startDate = new Date(nowDate.setDate(nowDate.getDate() - 31)).Format("yyyy-MM-dd"),
            start = new Date(nowDate.setDate(nowDate.getDate() - 1000)).Format("yyyy-MM-dd")
        console.log(tadayDate, startDate)
        this.setData({
            tadayDate: tadayDate,
            endDate: tadayDate,
            startDate: startDate,
            start: start
        })
    },
    toExtract(e){
        wx.setStorageSync("balance", this.data.balance)
        wx.navigateTo({
            url: '/pages/accountWithdrawal/accountWithdrawal',
        })
    },
    toggleType(e){
        this.setData({
            currentTab:e.target.dataset.index
        })
    },
})