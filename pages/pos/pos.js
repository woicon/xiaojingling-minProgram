const app = getApp()
var base = require('../../utils/util.js')
Page({
    data: {
        amt: "1000",
        discountAmt: "0",
        amtEmpty: true,
        loadPay: false,
        couponList: null,
        payMsg: '等待输入密码',
        couponChannel: ["微信可用", "支付宝可用"],
        goodsDetail: [],
        borderHeight: null,
        hideBorder: true,
        amtHand: true,
        discountStatus: false,
        couponType: app.types.couponType,
        couponStatus: false
    },
    onLoad(options) {
        let coupon = null
        if (options.coupon) {
            coupon = wx.getStorageSync("selectCoupon")
        }
        this.setData({
            isPX: app.systemInfo.isPX,
            coupon
        })
        this.discountRes()
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
    showKeybord(e) {
        let amtHand = e.currentTarget.id == "amt" ? true : false
        this.setData({
            hideBorder: false,
            couponStatus: false,
            amtHand
        })
    },
    toggleCoupon(e) {
        this.setData({
            hideBorder: true,
            couponStatus: !this.data.couponStatus,
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
    inputDiscount() {
        this.setData({
            discountStatus: !this.data.discountStatus,
            amtHand: !this.data.amtHand
        })
    },
    discountInput(e) {
        let discountAmt = e.detail.value
        if (Number(discountAmt) > this.data.amt) {
            app.tip('优惠金额不可超过消费金额')
        } else {
            this.setData({
                discountAmt
            })
        }
    },
    discountBlur(e) {
        let value = e.detail.value
        if (value != '' && Number(value) > 0) {
            this.setData({
                discountStatus: false
            })
        }
    },
    cooseCoupon() {
        this.setData({
            showCoupon: true
        })
    },
    discountRes(amts, coupon) {
        let c = this.data.coupon,
            a = this.data.amt,
            discountAmt = 0,
            discount = [],
            leastArr = [],
            leastMax = 0,
            realAmt = 0
        // 0代金券 1折扣券 2兑换券 5单品代金券 6会员卡 7单品折扣 8单品特价券 9全场满减券
        //兑换  types = (item) => item.cardTemplate.type == 2
        //单品 types = (item) => item.cardTemplate.type == 5 || item.cardTemplate.type == 7 || item.cardTemplate.type == 8 || item.cardTemplate.type == -1
        //全场 types = (item) => item.cardTemplate.type == 0 || item.cardTemplate.type == 9 || item.cardTemplate.type == 1 || item.cardTemplate.type == -2
        // 全场券 只能核销一张
        // 单品券 不限制核销数量
        // 兑换券 不限制核销数量
        // 兑换券 可 与单品券混核 也可以与全场券
        // 单品 全场 不能混核
        //leastCost math
        let least = c.filter(item => {
            let leastCost = item.cardTemplate.leastCost
            if (leastCost > 0) {
                leastArr.push(leastCost)
                return leastCost
            }
        })
        console.log(least, leastArr)
        if (leastArr.length > 0) {
            let m = leastArr[0]
            leastArr.forEach(item => {
                if(item>m){
                    m = item
                }
            })
            leastMax = m
        }
        //discount amt math
        let amt = Number(a)
        console.log(amt)
        c.forEach((item,index) => {
            let type = item.cardTemplate.type
         
            if (type == 7 || type == 1) {
                console.log(item,index)
                discount.push(amt - (amt * (item.cardTemplate.discount * 0.1)))
            } else if(type != 2){
                console.log(item.cardTemplate.type, item.cardTemplate.specialPrice || item.cardTemplate.reduceCost, index)
                discount.push(item.cardTemplate.reduceCost || item.cardTemplate.specialPrice)
            }
        })
       let allDiscount =  discount.reduce((acc,cur) => acc + cur)
       realAmt = (amt - allDiscount).toFixed(2)
       let amtes = {
           allDiscount,
           realAmt
       }
        console.log(discount, allDiscount.toFixed(2),amtes)
    },
    touchKey(e) {
        let num = e.target.dataset.number,
            amt = this.data.amt,
            discountAmt = this.data.discountAmt,
            hideBorder = num != 'h' ? false : true,
            inputValue = (oldnum) => {
                let addAmt = `${oldnum}${num}`,
                    amtReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/,
                    nums = (oldnum == "0" && num == "0") ? oldnum : num,
                    _amt = oldnum == "0" ? (num == '.' ? "0." : num) : (amtReg.test(addAmt) ? addAmt : oldnum)
                console.log(oldnum, num, nums, _amt)
                return _amt.length < 10 ? _amt : oldnum
            }
        if (num != 'h') {
            if (this.data.amtHand) {
                this.setData({
                    amtEmpty: false,
                    hideBorder,
                    amt: inputValue(amt)
                })
            } else {
                this.setData({
                    discountAmt: inputValue(discountAmt)
                })
            }
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
        let amt = Number(this.data.amt).toFixed(2)
        if (amt == 0.00) {
            wx.showToast({
                title: '请输入收款金额',
                icon: "none"
            })
        } else {
            wx.navigateTo({
                url: `/pages/posToPay/posToPay?total=${this.data.amt}&mark=${this.data.orderRemark ? this.data.orderRemark : ''}`,
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
    creatPay(payerAccount) {
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
            realAmt: Number(that.data.amt).toFixed(2),
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
                    amt: "0",
                    amtEmpty: true,
                })
            })
    },
    checkPay(checkParmas) {
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

    delNumber() {
        let amt = this.data.amt,
            discountAmt = this.data.discountAmt,
            del = (str, amt, status) => {
                let strLength = str.length,
                    _amt = str.substring(0, strLength - 1),
                    _status = _amt == 0 ? false : true
                this.setData({
                    [status]: _status,
                    [amt]: _amt == '' ? "0" : _amt
                })
            }
        this.data.amtHand ? del(amt, "amt", "amtEmpty") : del(discountAmt, "discountAmt", "discountAmt")
    }
})