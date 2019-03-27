const api = require('../../openApi/api.js')
Page({
    data: {
        loading: true
    },
    onLoad(options){
        this.memberGet(options.id)
    },
    memberGet(couponId){
        api.memberGet({ couponNo: couponId}).then(res=>{
            return res.member
        }).then(member=>{
            const memberId = member.memberId
            api.memberCouponList({ memberId }).then(couponList => {
                console.log(couponList)
                const coupon = couponList.items
                this.setData({
                    coupon,
                    member,
                    loading: false,
                    listloading:false
                })
            })
        })
    },
    toUpper(e){
        console.log("toUpper:::",e)
    },
    toLower(e){
        console.log("tolower:::")
    }
})