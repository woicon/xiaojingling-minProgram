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
        hideBorder: false,
        amtHand: true,
        discountStatus: false,
        couponType: app.types.couponType,
        couponStatus: false,
        leastMax: 0,
        realAmt: 0,
        discountAll: 0

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

    },
    onReady() {
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
            this.setData({
                borderHeight: fheight * 4,
                keyHeight: fheight
            })
        })
        this.discountRes()
    },
    showKeybord(e) {
        let amtHand = e.currentTarget.id == "amt" ? true : false
        this.setData({
            hideBorder: false,
            couponStatus: false,
            amtHand
        })
    },
    currHand(e) {},
    toggleCoupon(e) {
        this.setData({
            hideBorder: true,
            couponStatus: !this.data.couponStatus,
        })
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
        if (this.data.coupon) {
            let c = this.data.coupon,
                a = amts || this.data.amt,
                discount = [],
                leastArr = [],
                discountAll = 0,
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
                    if (item > m) {
                        m = item
                    }
                })
                leastMax = m
            }
            //discount amt math
            let amt = Number(a)
            console.log(amt)
            c.forEach((item, index) => {
                let card = item.cardTemplate,
                    type = card.type
                //console.log("least::", card.leastCost)
                if (amt >= card.leastCost) {
                    //discount coupon
                    if (type == 7 || type == 1) {
                        discount.push(amt - (Number(amt * (card.discount * 0.1))))
                    } else if (type == 5) {
                        discount.push(card.reduceCost)
                    } else if (type == 8) {
                        discount.push(card.goodItem.itemPrice - card.specialPrice)
                        //  || card.specialPrice
                    } else if (type != 2 && card.reduceCost) {
                        //reduce coupon
                        discount.push(card.reduceCost)
                    }
                }
            })
            console.log("discount：：：：", discount)
            if (discount.length > 0) {
                discountAll = discount.reduce((acc, cur) => acc + cur)
                realAmt = (amt - discountAll).toFixed(2)
            }
            let amtes = {
                discountAll: discountAll.toFixed(2),
                realAmt,
                leastMax,
                leastAmt: null
            }
            if (amt > discountAll && amt > leastMax) {
                this.setData(amtes)
            }  else {
                this.setData({
                    realAmt: 0,
                    discountAll: 0,
                    leastAmt: leastMax > discountAll - amt ? leastMax.toFixed(2) : (discountAll - amt).toFixed(2)
                })
            }
            console.log(discount, discountAll.toFixed(2), amtes)
        }
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
                const amts = inputValue(amt)
                if (this.data.coupon) {
                    this.discountRes(amts)
                }
                this.setData({
                    amtEmpty: false,
                    hideBorder,
                    amt: amts
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
    delChoose(e) {
        console.log(e)
        let coupon = this.data.coupon
        coupon.splice(e.currentTarget.dataset.index, 1);
        this.discountRes()
        this.setData({
            coupon
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
            // wx.navigateTo({
            //     url: `/pages/posToPay/posToPay?total=${this.data.amt}&mark=${this.data.orderRemark ? this.data.orderRemark : ''}`,
            // })
            scanPay()
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

    scanPay() {
        wx.scanCode({
            success: (res) => {
                let outTradeNo = `${new Date().Format('yyyyMMddhhmmss')}${app.base.randomNum(4)}`
                let params = {
                    merchantCode: app.commonParams('merchantCode'),
                    outTradeNo: outTradeNo,
                    totalAmount: this.data.amt,
                    authCode: res.result,
                    operatorId: app.commonParams('operatorId'),
                }
                if (this.data.discountAmt && this.data.discountAmt > 0) {
                    params.unDiscountAmount = (this.data.discountAmt).toFixed(2)
                }
                if (this.data.orderRemark && this.data.orderRemark > 0) {
                    params.orderRemark = this.data.orderRemark
                }
                console.log(res)
                api.pay(params).then(res => {
                    console.log(res)
                    if (res.code == 'FAILED') {
                        wx.showModal({
                            title: res.subMsg,
                            content: res.msg,
                            success: (res) => {
                                if (res.confirm) {
                                    this.scanPay()
                                }
                            }
                        })
                    } else if (res.code == 'SUCCESS') {
                        wx.setStorageSync('payDetail', res)
                        wx.redirectTo({
                            url: '/pages/posPaySuccess/posPaySuccess',
                        })
                    }
                })
            }
        })
    },

    paySuccess(data) {
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
    delNumber() {
        let amt = this.data.amt,
            discountAmt = this.data.discountAmt,
            del = (str, amt, status) => {
                let strLength = str.length,
                    _amt = str.substring(0, strLength - 1)
                this.setData({
                    [amt]: _amt == '' ? "0" : _amt
                })
            }

        if (this.data.amtHand) {
            let amtValue = del(amt, "amt")
            if (this.data.coupon) {
                this.discountRes(amtValue)
            }
        } else {
            del(discountAmt, "discountAmt")
        }
    }
})