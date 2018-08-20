var api = require('../../openApi/api.js')
Page({
    data: {
        login: {}
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
                if (res.code == 'FAILED') {
                    wx.showToast({
                        title: res.subMsg,
                        icon: 'none'
                    })
                } else if (res.code == 'SUCCESS') {
                    this.loginSi(parmas)
                        .then(res => {
                            wx.reLaunch({
                                url: '/pages/report/report',
                            })
                        })
                }
            })
    },
    loginSi: function(parmas) {
        let arg = {
            loginName:parmas.userName,
            password:parmas.passWord
        }
        return api.loginSi(arg)
            .then((res) => {
                console.log("::::LOGIN&SI::::", res)
                let loginData = res
                if (loginData.state == -1) {
                    wx.showToast({
                        title: loginData.obj,
                        icon: "none"
                    })
                } else if (loginData.state == 1) {
                    wx.setStorageSync("loginData", loginData.obj)
                    wx.setStorageSync("siKey", loginData.partnerKey)
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    clearInput(e) {
        console.log(e)
        let login = this.data.login
        login[e.target.dataset.id] = ''
        this.setData({
            login: login
        })
    },
    loginInput(e) {
        console.log(e)
        const login = this.data.login
        login[e.target.id] = e.detail.value
        const loginDisable = (login.passWord && login.userName) ? false : true
        this.setData({
            login: login,
            loginDisable: loginDisable
        })
    },
    loginBlur(e) {
        if (e.detail.value == '') {
            this.setData({
                isEmpty: e.target.id
            })
        }
    },
    focusInput(e) {
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