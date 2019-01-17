let app = getApp()
const api = require('../../openApi/api.js')
Page({
    data: {

    },
    onLoad(){
        wx.setNavigationBarTitle({
            title: '核销',
        })
    },
    scanCopuon(){
        wx.scanCode({
            success:(res) => {
                    console.log(res)
                    this.setData({
                        couponNo: res.result
                    })
            },
        })
    },
    checkGift(){
        if (this.data.couponNo){
            this.giftConsume(this.data.couponNo)
        }
    },
    giftConsume(couponNo){
        let params = {
            couponNo: this.data.couponNo
        }
        api.giftConsume(params).then(res=>{
            console.log(res)
            wx.showToast({
                title: res.msg,
                icon:'none'
            })
        })
    }
})