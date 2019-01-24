// pages/tradeDetail/tradeDetail.js
Page({
    data: {
        status: {
            '01': '扣减成功',
            '02': '提现成功',
            '03': '提现失败'
        }
    },
    onLoad (options) {
        this.setData({
            detail:wx.getStorageSync("tradeDetail")
        })
    }
})