let app = getApp()
const api = require('../../openApi/api.js')
Page({
    data: {
        status: ['启用', '禁用', '删除'],
        type: ['聚合支付', '绑定码'],
        roles:app.types.roles,
        role: app.commonParams('role'),
        list: [],
        login: wx.getStorageSync("login")
    },
    onLoad(options) {
        this.payCodeList()
    },
    payCodeList() {
        let params = {
            merchantCode: app.commonParams("merchantCode")
        }
        if (this.data.role == '2') {
            params.operatorId = app.commonParams("operatorId")
        }
        api.payCodeList(params).then(res => {
            this.setData({
                list: res.payCodeList
            })
        })
    },
    bindPayCode() {
        wx.scanCode({
            success: (code) => {
                console.log(code.result)
                let cardUrl = code.result
                if (cardUrl.indexOf('pay?code=') != -1) {
                    let cardCode = app.getQueryString(cardUrl)
                    console.log(cardCode)
                    let params = {
                        payCode: cardCode.code,
                        merchantCode: app.commonParams("merchantCode")
                    }
                    app.commonParams('role') == 2 ? params.operatorId = app.commonParams('operatorId') : ''
                    api.bindPayCode(params).then(res => {
                        wx.showModal({
                            title: res.msg,
                            content: res.subMsg,
                            showCancel: false
                        })
                        wx.showToast({
                            title: res.msg,
                            icon: "none"
                        })
                        this.payCodeList()
                    })
                } else {
                    wx.showToast({
                        title: '该店码不存在',
                        icon: "none"
                    })
                }

            }
        })
    },
    unBindPayCode(e) {
        wx.showModal({
            title: '提示',
            content: '确定要删除店码吗？',
            success: (res) => {
                if (res.confirm) {
                    this.delPayCode(e)
                }
            }
        })
    },
    toPayCode(e){
        wx.navigateTo({
            url: `/pages/payQrcode/payQrcode?code=${e.currentTarget.dataset.code}`,
        })
    },
    delPayCode(e) {
        let params = {
            payCode: e.target.dataset.id,
            merchantCode: app.commonParams("merchantCode")
        }
        api.unBindPayCode(params).then(res => {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
            this.payCodeList()
        })
    },
})