var api = require('../../openApi/api.js')
Page({
    data: {

    },
    onLoad: function(options) {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
        })
    },
    login: function(e) {
        let parmas = e.detail.value
        api.login(parmas)
            .then(res => {
                wx.setStorageSync("login", res)
                wx.reLaunch({
                    url: '/pages/report/report',
                })
            })
    },
    onReady: function() {

    },

    onShow: function() {

    },

    onHide: function() {

    },
    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})