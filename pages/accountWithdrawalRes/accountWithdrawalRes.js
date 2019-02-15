let app = getApp()
const api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
Page({

    data: {
        status: {"01":'扣减成功',"02":'提现成功', "03":'提现失败'}
        
    },

    onLoad (options) {
      
    },
    toAccount(){
        wx.redirectTo({
            url: '/pages/account/account',
        })
    },
    onShow(){
        let detail = wx.getStorageSync("tradeDetails")
        detail.gmtCreated = new Date(detail.gmtCreated).Format('yyyy-MM-dd hh:mm:ss')
        this.setData({
            detail: wx.getStorageSync("tradeDetails")
        })
    },
})