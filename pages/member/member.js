Page({

    data: {

    },
    onLoad: function(options) {
        app.checkLogin()
        
    },
    
    getUserInfo(e) {
        console.log(e.detail)
        const userInfo = e.detail
        wx.setStorageSync("userInfo", e.detail.userInfo)
        const authInfo = wx.getStorageSync("authInfo")

        this.setData({
            userInfo: e.detail.userInfo
        })
    },
    exitSys() {
        wx.showModal({
            title: '提示',
            content: '是否确定退出',
            success: (res) => {
                if (res.confirm) {
                    wx.clearStorage()
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                    wx.setNavigationBarColor({
                        frontColor: "#000000",
                        backgroundColor: '#ffffff',
                    })
                    wx.setNavigationBarTitle({
                        title: '收款搭档',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    onReady() {

    },

    onShow() {
        this.setData({
            member: wx.getStorageSync("login")
        })
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