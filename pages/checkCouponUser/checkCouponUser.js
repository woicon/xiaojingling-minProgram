const api = require('../../openApi/api.js')
var base = require('../../utils/util.js')
import types from '../../utils/types'
Page({
    data: {
        loading: true,
        couponType: ['全部', '兑换券', '单品券', '全场券'],
        currentTab: 0,
        selectCoupon: []
        // 0代金券 1折扣券 2兑换券 5单品代金券 6会员卡 7单品折扣 8单品特价券 9全场满减券
    },
    onLoad(options) {
        if (options.id) {
            this.memberGet(options.id)
            this.setData({
                couponType: types.couponType
            })
        }
    },
    memberGet(couponId) {
        api.memberGet({
            couponNo: couponId
        }).then(res => {
            return res.member
        }).then(member => {
            if (member.memberId) {
                const memberId = member.memberId
                api.memberCouponList({
                    memberId,
                    pageSize: 100
                }).then(couponList => {
                    console.log(couponList)
                    const coupon = couponList.items
                    base.batFormatDate(coupon, 'getDate')
                    base.batFormatDate(coupon, 'endDate')
                    let selCoupon = coupon.filter(item => {
                        return item.couponNo == couponId
                    })
                    console.log(selCoupon)
                    let couponRules = (item) => {
                        let relues = null
                        let leastCost = item.leastCost != 0 ? `消费满${item.leastCost}可用,` : ''
                        switch (item.type) {
                            case 0:
                                return `价值${item.reduceCost}元代金券一张，${leastCost}不可与其他优惠共享。</text >`
                                break
                            case 7:
                                return `凭此券消费打${item.discount}折，适用于购买${item.goodItem.itemName}使用，${leastCost}不可与其他优惠共享。`
                                break
                            case 5:
                                return `价值${item.reduceCost}元代金券一张，适用于购买${item.goodItem.itemName}使用，${leastCost}不可与其他优惠共享。`
                                break
                            case 1:
                                return `凭此券消费享受${item.discount}折优惠，适用于全场消费，不与单品优惠券叠加使用。`
                                break
                            case 9:
                                let leastCosts = item.leastCost != 0 ? `全场消费满${item.leastCost}元,减${item.reduceCost}元，` : ''
                                return `凭此消费券，${leastCosts}不可与其他优惠共享。</text >`
                                break
                            case 2:
                                return `兑换${item.gift}使用`
                                break
                        }
                    }
                    selCoupon[0].rules = couponRules(selCoupon[0].cardTemplate);
                    this.setData({
                        coupon,
                        member,
                        selCoupon: selCoupon[0],
                        loading: false,
                        listloading: false
                    })
                })
            }
        })
    },
    toggleCouponType(e) {
        console.log(e)
        this.setData({
            listloading: true
        })
        let currentTab = e.target.dataset.index,
            types = null
        api.memberCouponList({
            memberId: this.data.member.memberId,
            pageSize: 100
        }).then(couponList => {
            const coupons = couponList.items
            base.batFormatDate(coupons, 'getDate')
            base.batFormatDate(coupons, 'endDate')
            switch (currentTab) {
                case 0:

                    break
                case 1:
                    types = (item) => item.cardTemplate.type == 2
                    break
                case 2:
                    types = (item) => item.cardTemplate.type == 5 || item.cardTemplate.type == 7 || item.cardTemplate.type == 8 || item.cardTemplate.type == -1
                    break
                case 3:
                    types = (item) => item.cardTemplate.type == 0 || item.cardTemplate.type == 9 || item.cardTemplate.type == 1 || item.cardTemplate.type == -2
                    break
            }

            let coupon = currentTab == 0 ? coupons : coupons.filter(types)
            this.setData({
                currentTab,
                coupon,
                listloading: false
            })
        })
    },
    selGoods(e) {

    },
    selCoupon(e) {
        console.log(e)
        let coupon = this.data.coupon,
            type = e.currentTarget.dataset.type,
            index = e.currentTarget.dataset.index,
            selectCoupon = this.data.selectCoupon,
            selCoupon = coupon[index]

        if (selectCoupon.length > 0) {
            let isAll = selectCoupon.some((item) => {
                let type = item.cardTemplate.tyep
                return type == 1 || type == 9 || type == 2
            })
            let isSigle = selectCoupon.some((item) => {
                let type = item.cardTemplate.tyep
                return type == 5 || type == 8 || type == 7
            })
            let isexChange = selectCoupon.some((item) => {
                let type = item.cardTemplate.tyep
                return type == 3
            })
            
            if (isAll){
                wx.showToast({
                    title: '全场券只能使用一张',
                })
            } else if (isSigle){

            }

        } else {
            console.log(selCoupon)
            selCoupon.checked = true
            selectCoupon.push(selCoupon)
        }
        this.setData({
            coupon
        })
    },
    backToPos(){
     
        wx.setStorageSync("selCoupon", this.data.selCoupon)
        this.setData({
            selCoupon: false
        })
        wx.navigateBack()
    },
    toUpper(e) {
        console.log("toUpper:::", e)
    },
    toLower(e) {
        console.log("tolower:::")
    }
})