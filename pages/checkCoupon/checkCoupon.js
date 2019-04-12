let app = getApp()
const api = require('../../openApi/api.js')
Page({
    data: {
        couponNo:null
    },
    onLoad() {
        wx.setNavigationBarTitle({
            title: '核销',
        })
    },
    scanCopuon() {
        wx.scanCode({
            success: (res) => {
                this.setData({
                    couponNo: res.result
                })
            },
        })
    },
    couponInput(e) {
        this.setData({
            couponNo: e.detail.value
        })
    },
    checkCoupon() {
        if (this.data.couponNo) {
            this.couponConsume(this.data.couponNo)
        }else{
            app.tip("请输入优惠券号")
        }
    },
    couponConsume(couponNo) {
        let params = {
            couponNo: this.data.couponNo,
            merchantCode: app.commonParams("merchantCode")
        }
        api.couponConsume(params).then(res => {
            app.tip(res.msg)
        })
    },
    giftConsume(couponNo) {
        let params = {
            couponNo: this.data.couponNo,
            merchantCode: app.commonParams("merchantCode")
        }
        api.giftConsume(params).then(res => {
            console.log(res)
            app.tip(res.msg)
        })
    }
})