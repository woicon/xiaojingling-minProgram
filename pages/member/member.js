let app = getApp()
var api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
Page({
    data: {
        role: app.commonParams("role")
    },
    onLoad(options) {
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
    },
    onShow() {
        this.setData({
            member: wx.getStorageSync("login")
        })
        this.checkBag()
        this.ksAccountList()
    },
    ksAccountList() {
        api.ksAccountList({}).then(res => {
            console.log(res)
            let list = res.accountList
            this.initBag(list, 0)
        })
    },
    cutNum(str) {
        return str.substring(str.length - 4)
    },
    changeAccount(e) {
        this.initBag(this.data.bag, e.detail.value)
    },
    initBag(accountList, index) {
        this.setData({
            bag: accountList,
            selBag: accountList[index],
            selNum: this.cutNum(accountList[index].balanceAccount)
        })
    },
    extract() {
        wx.setStorageSync("selBag", this.data.selBag)
        wx.navigateTo({
            url: `/pages/account/account?id=${this.data.selBag.transactionId}`,
        })
    },
    checkBag() {
        let parmas = {
            codeName: app.commonParams("merchantCode"),
            merchantNo: app.commonParams("appId"),
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
                    this.getKsUrl()
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
    getKsUrl() {
        console.log(this.data.bag)
        let parmas = {
            orderNo: `${new Date().Format('yyyyMMddHHmmss')}${base.randomNum(5)}`,
            codeName: app.commonParams("merchantCode"),
            merchantNo: app.commonParams("appId"),
            transactionId: this.data.bag[0].transactionId
        }
        api.getKsWithdrawUrl(parmas)
            .then(res => {
                console.log(res.obj.resp_url)
                wx.setStorageSync("rsurl", res.obj.resp_url)
                // if (res.code = "001801") {
                //     wx.navigateTo({
                //         url: `/pages/txH5/txH5?url=${res.obj.resp_url}`,
                //     })
                // }
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
    clipNo: function(e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.id,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {}
                })
            }
        })
    },
    callServ: function() {
        wx.navigateTo({
            url: `/pages/customerService/customerService`,
        })
        // wx.makePhoneCall({
        //     phoneNumber: '4000122155'
        // })
    },
    toggleBag() {

    },
    onShareAppMessage() {

    }
})