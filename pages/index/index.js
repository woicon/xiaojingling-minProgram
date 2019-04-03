const app = getApp()
var api = require('../../openApi/api.js')
Page({
    data: {
        loading: true,
        hideBank: true
    },
    onLoad() {
        try{
            const role = wx.getStorageSync("loginData").identity
            this.setData({
                ksRole: role,
                role: wx.getStorageSync("login").role
            })
            if (role == 1) {
                this.checkBag()
                this.ksAccountList()
            } else {
                this.setData({
                    loading: false
                })
            }
        } catch (error){
            wx.clearStorage()
            wx.redirectTo({
                url: '/pages/login/login',
            })
        }
    },

    ksAccountList() {
        api.ksAccountList({
            merchantCode: app.commonParams('merchantCode')
        }).then(res => {
            let list = res.accountList
            if (list.length > 0) {
                list = list.map(item => {
                    item.acc = this.cutNum(item.balanceAccount)
                    return item
                })
                this.initBag(list, 0)
            } else {
                this.setData({
                    loading: false
                })
            }
        })
    },
    cutNum(str) {
        return str.substring(str.length - 4)
    },
    changeAccount(e) {
        this.initBag(this.data.bag, e.detail.value)
    },
    showBanks(e) {
        this.setData({
            hideBank: !this.data.hideBank,
        })
    },
    initBag(accountList, index) {
        this.setData({
            bag: accountList,
            selBag: accountList[index],
            currentBag: index,
            selNum: this.cutNum(accountList[index].balanceAccount),
            loading: false,
            hideBank: true
        })
    },
    toggleBag(e) {
        this.initBag(this.data.bag, e.target.dataset.index)
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
                    // this.setData({
                    //     bag: bagList,
                    //     selBag: bagList[0],
                    // })
                    //this.getKsUrl()
                }
            })
    }
})