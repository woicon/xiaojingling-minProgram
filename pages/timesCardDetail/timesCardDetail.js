const api = require('../../openApi/api.js')
const app = getApp()
console.log(app)
Page({
    data: {
        checkTimes: 1,
        loading: true
    },
    onLoad(options) {
        if (options.cardNo) {
            api.timesCardDetail(options).then(card => {
                console.log(card)
                let dates = card.endDate.replace(/-/g, "/"),
                    cardNo = card.cardNo,
                    n=''
                card.endDate = new Date(dates).Format('yyyy/MM/dd')
                for (var i in cardNo) {
                    let id = Number(i) + 1,
                        num = n + cardNo[i]
                    n = (id % 4 == 0) ? num+' ' : num
                }
                card.cardNos = n
                this.setData({
                    card,
                    loading: false,
                    role:app.commonParams('role')
                })
            })
        } else {
            this.setData({
                error: true,
                errorMsg: '"次卡不存在"'
            })
        }
    },
    checkTotal(e) {
        if (e.target.id) {
            let id = e.target.id,
                checkTime = this.data.checkTimes,
                addValue = checkTime <= this.data.card.suplusTimes ? checkTime + 1 : checkTime,
                minValue = checkTime > 1 ? checkTime - 1 : checkTime,
                checkTimes = id == 'add' ? addValue : minValue
            this.setData({
                checkTimes
            })
        }
    },
    checkTimesCard(e) {
        wx.showModal({
            title: '确认核销',
            confirmText: "核销",
            confirmColor: '#0ec695',
            content: `用户${this.data.card.memberName}(${this.data.card.memberMobile})的${this.data.card.cardName}的次卡${this.data.checkTimes}次`,
            success: (res) => {
                if (res.confirm) {
                    checkCard()
                }
            }
        })
        let checkCard = () => {
            let params = {
                cardNo: this.data.card.cardNo,
                checkTimes: this.data.checkTimes,
                consumeMerchantCode: app.commonParams('merchantCode'),
                consumeEmployeeId: app.commonParams('operatorId')
            }
            api.timesCardConsume(params).then(res => {
                console.log(res)
                if (res.code == 'SUCCESS'){
                    wx.setStorageSync("checkRes", this.data)
                    wx.redirectTo({
                        url: '/pages/checkRes/checkRes',
                    })
                }else{
                    this.setData({
                        error:false
                    })
                    app.tip(res.msg)
                }
            })
        }
    }
})