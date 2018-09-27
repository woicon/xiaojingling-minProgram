let app = getApp()
var api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
Page({
    data: {

    },
    onLoad: function(options) {
        app.checkLogin()
        
        wx.setNavigationBarTitle({
            title: '个人中心',
        })
        try {
            let userInfo = wx.getStorageSync("userInfo")
            this.setData({
                userInfo: userInfo
            })
        } catch (error) {
            this.setData({
                userInfo: null
            })
        }
        this.checkBag()
    },
    checkBag: function() {
        let parmas = {
            codeName: app.commonParmas("merchantCode"),
            merchantNo: app.commonParmas("appId"),
        }
        api.payPlatFormInforKs(parmas)
            .then(res => {
                console.log(res)
                if (res.code == "001701") {
                    wx.setStorageSync("bag", res.obj)
                    let bagList = wx.getStorageSync("bag")
                    for (let i in bagList) {
                        bagList[i].endNum = bagList[i].balanceAccount.substr(bagList[i].balanceAccount.length - 4)
                    }
                    wx.setStorageSync("bag", bagList[0])
                    this.setData({
                        bag: bagList
                    })
                }
            })
    },
    getUserInfo(e) {
        const userInfo = e.detail
        wx.setStorageSync("userInfo", e.detail.userInfo)
        const authInfo = wx.getStorageSync("authInfo")
        this.setData({
            userInfo: e.detail.userInfo
        })
    },
    getKsUrl: function() {
        let parmas = {
            orderNo: `${new Date().Format('yyyyMMddHHmmss')}${base.randomNum(5)}`,
            codeName: app.commonParmas("merchantCode"),
            merchantNo: app.commonParmas("appId"),
            transactionId: this.data.bag[0].transactionId
        }
        api.getKsWithdrawUrl(parmas)
            .then(res => {
                console.log(res.obj.resp_url)
                wx.setStorageSync("rsurl", res.obj.resp_url)
                if (res.code = "001801") {
                    wx.navigateTo({
                        url: `/pages/txH5/txH5?url=${res.obj.resp_url}`,
                    })
                }
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
    clipNo: function(e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.id,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                    }
                })
            }
        })
    },
    onShow() {
        this.setData({
            member: wx.getStorageSync("login")
        })
    },
    callServ: function() {
        wx.makePhoneCall({
            phoneNumber: '4000122155'
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

    onShareAppMessage: function() {

    }
})