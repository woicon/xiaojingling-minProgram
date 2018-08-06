var api = require('../../openApi/api.js')
Page({
    data: {
        login:{}
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
    clearInput (e) {
        console.log(e)
        let login = this.data.login
        login[e.target.dataset.id] = ''
        this.setData({
            login: login
        })
    },
    loginInput (e) {
        console.log(e)
        const login = this.data.login
        login[e.target.id] = e.detail.value
        const loginDisable = (login.passWord && login.userName) ? false : true
        this.setData({
            login: login,
            loginDisable: loginDisable
        })
    },
    loginBlur (e) {
        if (e.detail.value == '') {
            this.setData({
                isEmpty: e.target.id
            })
        }
    },
    focusInput (e) {
        this.setData({
            focus: e.currentTarget.dataset.index
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