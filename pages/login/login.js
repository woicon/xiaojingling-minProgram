var api = require('../../openApi/api.js')
Page({
    data: {
        login: {}
    },
    onLoad(options) {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
        })
        wx.setNavigationBarTitle({
            title: '收款小精灵商户通',
        })
    },
    login(e) {
        let parmas = e.detail.value
        api.login(parmas)
            .then(res => {
                console.log(res)
                wx.setStorageSync("login", res)
                wx.setStorageSync("loginName",parmas.userName)
                if (res.code == 'FAILED') {
                    wx.showToast({
                        title: res.subMsg,
                        icon: 'none'
                    })
                } else if (res.code == 'SUCCESS') {
                    this.loginSi(parmas)
                        .then(res => {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        })
                }
            })
    },
    loginSi(parmas) {
        let arg = {
            loginName: parmas.userName,
            password: parmas.passWord
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
    }
})