let app = getApp()
var api = require('../../openApi/api.js')
Page({
    data: {
        phone: "15210719964",
        endTime:0,
        disableSend:true,
        bank: require('bank.js')
    },
    onLoad(options) {
        let selBag = wx.getStorageSync("selBag")
        let cardNo = selBag.balanceAccount
        let cardNos = ''
        for (let i in cardNo) {
            if (i > 3 && i < 12) {
                cardNos += '*'
            } else {
                cardNos += cardNo[i]
            }

        }
        console.log(cardNos)
        this.setData({
            balance: wx.getStorageSync("balance"),
            selBag: wx.getStorageSync("selBag"),
            storeDetail: wx.getStorageSync("storeDetail"),
            cardNo: cardNos
        })
    },
    withdraw() {
        let params = {

        }
    },
    allTotal() {
        this.setData({
            total: this.data.balance.availableBalance
        })
    },
    changeTotal(e) {
        console.log(e)
        if (e.detail.value > this.data.balance.availableBalance) {
            wx.showToast({
                title: '提取金额不能大于可提取金额',
                icon: "none",
            })
            this.setData({
                total: ''
            })
        }
    },
    sendCode() {
        this.setData({
            endTime:60
        })
        this.setTime()
        this.getPhoneCode()
    },

    setTime(){
        let endTime = this.data.endTime
        if(this.data.endTime>0){
            this.setData({
                endTime: endTime -1
            })
        }else{
            this.setData({
                endTime: 0
            })
        }
        setTimeout(() => { 
            this.setTime()
        }, 1000)
    },
    getPhoneCode() {
        let balance = this.data.balance
        let params = {
            version: '1.0',
            input_charset: 'UTF-8',
            service: 'kshbank_sms_send',
            partner_id: '18110120453815253',
            core_merchant_no:'KS_N1453170986',
            fund_pool_no: "PN01000000000000213",
            payment_id: '3',
            out_trade_no: '82934829348203947829387423',
            pay_channel: 'ZF0016_01_001',
            phone_no:this.data.phone
        }
        api.ksApi(params, '519e220dc1cc6ab517ffff60b59a8d51').then(res => {
            console.log(res)
        })
    },
    changePhone(e){
        let phone = e.detail.value
        if (phone.length == 11){
            let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
            let disableSend
            if(!reg.test(phone)){
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon:'none'
                })
            }
            this.setData({
                disableSend: !reg.test(phone) ? true : false,
                phone: e.detail.value
            })
        }else{
            this.setData({
                disableSend:true,
                phone: e.detail.value
            })
        }
    },
    withDrawal(){
        let store = this.data.storeDetail
        let params = {
            service:'trade_single_withdraw_remittance',
            partner_id:'18042621422975713',
            core_merchant_no:'N0949188211',
            fund_pool_no:'PN01000000000000001 ',
            out_trade_no_ext:'',
            merchant_extend_field_1: store.bank,//银行名称
            merchant_extend_field_2: this.data.bank[store.bank],//银行名称
            merchant_extend_field_3: store.storeCode,//来自【门店详情】接口返回【门店编号】
            merchant_extend_field_4: store.storeFullName,//来自【门店详情】接口返回【门店名称】
            merchant_extend_field_5: store.agentNo,//来自【门店详情】接口返回【代理商编号】
            withdraw_account_no:'',//提现账户编号
            pay_channel:'ZF0016_01_001',
            pay_transaction_id: "000000000015208", 
            pay_amount: this.data.total,//提现金额
            receive_account: this.data.selBag.balanceAccount
        }

    }
})