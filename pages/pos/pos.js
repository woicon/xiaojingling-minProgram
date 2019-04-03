const app = getApp()
var base = require('../../utils/util.js')

Page({
    data: {
        totalPrice: "0",
        priceEmpty: true,
        loadPay: false,
        couponList: null,
        payMsg: '等待输入密码',
        couponChannel: ["微信可用", "支付宝可用"],
        goodsDetail: [],
        borderHeight: null,
        hideBorder:false
    },
    onLoad(options) {
        this.setData({
            isPX: app.systemInfo.isPX
        })
    },
    onReady() {
        let that = this
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#0EC695',
        })
        wx.setNavigationBarTitle({
            title: '收银',
        })
        var query = wx.createSelectorQuery()
        query.select('#alipay').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
            let bheight = res[0].width
            let fheight = bheight.toFixed()
            that.setData({
                borderHeight: fheight * 4,
                keyHeight: fheight
            })
        })
    },
    showKeybord(){
        this.setData({
            hideBorder:false
        })
    },
    onShow() {
        let that = this
        try {
            const loginData = wx.getStorageSync("loginData")
            if (loginData) {
                that.setData({
                    isLogin: false,
                    pageLoading: false
                })
            } else {
                that.setData({
                    isLogin: true,
                    pageLoading: false
                })
            }
        } catch (error) {
            this.setData({
                isLogin: true
            })
        }
    },

    cooseCoupon() {
        this.setData({
            showCoupon: true
        })
    },

    couponTotal(e) {
        let that = this
        let couponList = that.data.couponList
        let couponItem = couponList[e.currentTarget.id]
        let goodsDetail = that.data.goodsDetail
        let detailItem = goodsDetail[couponItem.detail] || null
        couponItem.quantity = couponItem.quantity || 0

        function changeTotal(doit) {
            couponItem.quantity = couponItem.quantity + doit
            detailItem.quantity = couponItem.quantity
        }
        if (e.target.id === "min") {
            if (couponItem.quantity === 1) {
                goodsDetail.splice([couponItem.detail], 1) // 删除 
                changeTotal(-1)
            } else if (couponItem.quantity > 0) {
                changeTotal(-1)
            }
        } else if (e.target.id === "add") {
            if (couponItem.quantity === 0) {
                goodsDetail.push({
                    goods_id: couponItem.no,
                    goods_name: couponItem.name,
                    quantity: 1,
                    price: couponItem.price
                })
                couponItem.detail = goodsDetail.length - 1
                couponItem.quantity = 1
            } else {
                changeTotal(+1)
            }
        }
        that.setData({
            goodsDetail: goodsDetail,
            couponList: couponList
        })
    },

    touchKey(e) {
        let total = this.data.totalPrice,
            num = e.currentTarget.dataset.number,
            decimalReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (num != 'h') {
            let _total = `${total}${num}`,
                nums = (total == "0" && num == 0) ? total : num,
                newTotal = total == "0" ? nums != '.' ? nums : "0." : decimalReg.test(_total) ? _total : total
            console.log(nums)
            this.setData({
                priceEmpty: false,
                totalPrice: newTotal.length < 8 ? newTotal : total
            })
        } else {
            this.setData({
                hideBorder: !this.data.hideBorder
            })
        }
    },
    checkCoupon(e) {
        wx.scanCode({
            success: (res) => {
                console.log(res)
                wx.navigateTo({
                    url: `/pages/checkCouponUser/checkCouponUser?id=${res.result}`,
                })
            }
        })
    },
    createPay(e) {
        let that = this
        let totalPrice = Number(this.data.totalPrice).toFixed(2)
        if (totalPrice == 0.00) {
            wx.showToast({
                title: '请输入收款金额',
                icon: "none"
            })
        } else {
            wx.navigateTo({
                url: `/pages/posToPay/posToPay?total=${this.data.totalPrice}&mark=${this.data.orderRemark ? this.data.orderRemark : ''}`,
            })
            // wx.scanCode({
            //     onlyFromCamera: true,
            //     success: (res) => {
            //         console.log("扫码返回结果：：：：：", res)
            //         this.creatPay(res.result)
            //     },
            //     fail: function (error) {
            //         console.log("扫码Error::", error)
            //     }
            // })
        }
    },
    markInput(e) {
        this.setData({
            orderRemark: e.detail.value
        })
    },
    creatPay: function(payerAccount) {
        let that = this
        wx.showLoading({
            title: '收款中',
            mask: true
        })
        console.log("::付款码::", payerAccount)
        var departmentNo = app.member("departmentNo")
        //下单支付参数
        let payParmas = {
            operatorNo: app.member("operatorNo"),
            operatorCn: app.member("operatorCn"),
            merchantId: app.member("merchantId"),
            departmentNo: departmentNo,
            departmentName: app.member("departmentName"),
            realAmt: Number(that.data.totalPrice).toFixed(2),
            codeName: app.member("codeName")
        }
        //支付检测参数
        let checkParmas = {
            creatorNo: app.member("operatorNo"),
            creatorCn: app.member("operatorCn"),
            codeName: app.member("codeName")
        }
        //创建订单号 年月日+随机4位数+门店编号
        let orderDate = new Date().Format("yyyyMMddhhmmss.S")
        let orderDates = orderDate.split("").map(n => n != '.' ? n : '').join("")
        let mtNo = departmentNo.split("")
        mtNo.splice(0, 4)
        const orderNo = orderDates + mtNo.join("") + base.randomNum(4)
        //end 创建订单号
        payParmas.payerAccount = payerAccount
        payParmas.orderNo = orderNo
        checkParmas.orderNo = orderNo
        api.createOrderPayByQrcode(payParmas)
            .then((res) => {
                console.log(":::::::支付结果::::::>>", res.data)
                let data = res.data
                switch (data.state) {
                    case 1: //支付成功
                        wx.hideLoading()
                        wx.setStorageSync("pos", JSON.parse(data.obj))
                        this.paySuccess(data.obj)
                        break
                    case -1: //支付失败
                        wx.showModal({
                            title: '提示',
                            content: data.obj,
                            showCancel: false,
                        })
                        wx.hideLoading()
                        break
                    case -2: //支付等待 输入密码 等待 检测
                        wx.showLoading({
                            title: data.obj,
                            mask: true
                        })
                        this.checkPay(checkParmas)
                        break
                    case 0:
                        break
                }
                this.setData({
                    totalPrice: "0",
                    priceEmpty: true,
                })
            })
    },
    checkPay: function(checkParmas) {
        wx.setStorageSync("checkParmas", checkParmas)
        api.checkPay(checkParmas)
            .then(res => {
                console.log('支付检测结果>>>>>>>>', res)
                let payResult = res.data
                switch (payResult.state) {
                    case 1: //支付成功
                        wx.hideLoading()
                        wx.setStorageSync("pos", JSON.parse(payResult.obj))
                        this.paySuccess(payResult.obj)
                        break
                    case 0: //支付失败
                        wx.showModal({
                            title: '支付结果',
                            content: payResult.obj,
                            showCancel: false,
                        })
                        break
                    case -1: //需要等待检测
                        setTimeout(() => {
                            this.checkPay(wx.getStorageSync("checkParmas"))
                        }, 3000)
                        break
                }
            })
    },
    paySuccess: function(data) {
        console.log("POSDATA::::", JSON.parse(data))
        wx.redirectTo({
            url: '/pages/posOk/posOk'
        })
    },
    hideCoupon: function() {
        this.setData({
            showCoupon: false
        })
    },
    getCoupon: function(arg) {
        let that = this
        const loginData = arg
        let parmas = {
            codeName: base.getValue(loginData, "codeName"),
            departmentId: base.getValue(loginData, "departmentId"),
        }
        api.getCoupon(parmas).then((res) => {
            that.setData({
                couponList: res.data.obj
            })
        })
    },

    delNumber: function() {
        let totals = this.data.totalPrice
        let strTotals = totals.toString()
        let totalsLength = strTotals.length
        let totalPrice = strTotals.substring(0, totalsLength - 1)
        this.setData({
            priceEmpty: totalPrice.length == 0 ? true : false,
            totalPrice: totalPrice == '' ? "0" : totalPrice
        })
    },
    lessInput(e) {

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