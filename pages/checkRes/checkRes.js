Page({
    onLoad(options) {
        this.setData({
            ...wx.getStorageSync("checkRes"),
            ...wx.getStorageSync("login")
        })
    },
    goBack(){
        wx.navigateBack()
    }
})