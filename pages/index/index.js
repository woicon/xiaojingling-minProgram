const app = getApp()
Page({
    data: {
    },
    onLoad() {
        this.setData({
            role: wx.getStorageSync("loginData").identity
        })
        
    }
})