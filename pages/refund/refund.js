const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        checkMa: false,
        mrkList: ["撤销重新下单", "商品不合格"],
        mrkToggle: [false, false],
        mrk: false,
        markNum: 0,
        savePwd: false,
        refDidable: true,
        diableTextarea: false,
        orderStatus: {
            'NOTPAY': '未支付',
            'SUCCESS': '已完成 ',
            'REFUND': '已退款',
            'CLOSED': '已关闭',
            'REVOKED': '已撤销',
            'PAYERROR': '失败'
        },
        orderStatusSel: ['全部支付状态', '未支付', '已完成', '已退款', '已关闭', '已撤销'],
        payTypeSel: ['全部支付方式', '微信', '支付宝 ', '会员'],
        payType: {
            WXPAY: '微信',
            ALIPAY: '支付宝 ',
            MPAY: '会员'
        }
    },
    onLoad: function(options) {
        this.setData({
            detail: wx.getStorageSync("refundDetail"),
            role: app.commonParams("role")
        })
    },

    refInput: function(e) {
        let num = e.detail.value
        let decimalReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        let newTotal = decimalReg.test(num) ? num : total
        let detail = this.data.detail
        if (Number(e.detail.value).toFixed(2) > Number(detail.receiptAmount).toFixed(2)) {
            wx.showToast({
                title: '退款金额不能大于订单实收金额',
                icon: 'none'
            })
            this.setData({
                refDidable: true
            })
        } else if (e.detail.value == '') {
            this.setData({
                refDidable: true
            })
        } else if (Number(e.detail.value).toFixed(2) != 0) {
            this.setData({
                refAmt: newTotal,
                refDidable: false
            })
        }
    },
    refundAll: function() {
        this.setData({
            refAmt: this.data.detail.receiptAmount,
            refDidable: false
        })
    },
    goRefund: function(e) {
        let nowDate = new Date()
        if (this.data.refAmt) {
            wx.showModal({
                title: "确定是否退款吗？",
                content: `退款金额${this.data.refAmt}元`,
                success: (res) => {
                    if (res.confirm) {
                        this.refundReq()
                    } else if (res.cancel) {
                        wx.showToast({
                            title: '退款取消',
                            icon: 'none'
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '请输入退款金额',
                icon: 'none'
            })
        }
    },
    refundReq: function() {
        let detail = this.data.detail
        let refAmt = this.data.refAmt
        if (Number(refAmt).toFixed(2) > Number(detail.receiptAmount).toFixed(2)) {
            wx.showToast({
                title: '退款金额不能大于订单实收金额',
                icon: 'none'
            })
        } else {
            wx.showLoading()
            let nowDate = new Date()
            let parmas = {
                refundNo: `${nowDate.Format("yyyyMMddhhmmss")}${nowDate.getTime()}${base.randomNum(4)}`,
                refundAmount: this.data.refAmt,
                merchantCode: detail.merchantCode
            }
            if (detail.outTradeNo) {
                parmas.outTradeNo = detail.outTradeNo
            } else if (detail.outTransactionId) {
                parmas.outTransactionId = detail.outTransactionId
            }
            //退款原因
            if (this.data.refundReason && this.data.refundReason.length > 0) {
                parmas.refundReason = this.data.refundReason
            }

            api.refund(parmas)
                .then(res => {
                    wx.hideLoading()
                    wx.showModal({
                        title: res.msg || res.subMsg,
                        content: res.subMsg || res.msg,
                        showCancel: false,
                        success: (data) => {
                            if ((data.confirm)) {
                                if (res.code == "SUCCESS") {
                                    wx.switchTab({
                                        url: '/pages/order/order',
                                    })
                                }
                            }
                        },
                    })
                })
        }

    },
    hideMa: function(e) {
        console.log(e)
        this.setData({
            checkMa: false
        })
    },
    selMrk: function(e) {
        let mrkToggle = this.data.mrkToggle
        let mrkList = this.data.mrkList
        mrkToggle[e.target.dataset.index] = !mrkToggle[e.target.dataset.index]
        let selMrk = []
        for (let i in mrkToggle) {
            if (mrkToggle[i]) {
                selMrk.push(mrkList[i])
            }
        }
        const mrks = selMrk.join()
        this.setData({
            mrkToggle: mrkToggle,
            selMrk: mrks
        })
    },
    mrkSubmit: function() {
        this.setData({
            mrk: false
        })
    },
    selectMrk() {
        this.setData({
            mrk: !this.data.mrk
        })
    },
    mrkOk() {
        this.setData({
            mrk: false
        })
    },
    mrkInput(e) {
        let markNum = e.detail.value.length
        if (markNum <= 50) {
            this.setData({
                refundReason: e.detail.value,
                markNum: e.detail.value.length
            })
        } else {
            wx.showToast({
                title: '不超过50',
                icon: "none"
            })
            this.setData({
                diableTextarea: true
            })
        }
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: '退款',
        })
    },
    onShow: function() {

    },

    onHide: function() {},

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})