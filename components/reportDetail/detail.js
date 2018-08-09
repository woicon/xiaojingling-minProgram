// components/reportDetail/detail.js
Component({
    properties: {
        details: { // 属性名
            type: Array,
            value: [],
            observer: "_changeDetail"
        }
    },
    data: {
        currIndex: null
    },
    methods: {
        _toggleDetail: function (e) {
            let currIndex = e.currentTarget.dataset.index == this.data.currIndex ? null : e.currentTarget.dataset.index
            this.setData({
                currIndex: currIndex
            })
        },
        _changeDetail: function (newData, oldData) {
            // for (let i in newData) {
            //     newData[i].allRefund = Number(newData[i].zfbRefundAmt + newData[i].wxRefundAmt).toFixed(2)
            //     newData[i].allAmt = Number(newData[i].wxAmt + newData[i].zfbAmt).toFixed(2)
            //     //newData[i].cashierName = newData[i].cashierName == null ? '默认门店' : newData[i].cashierName
            // }
            this.setData({
                detail: newData,
            })
        }
    }
})
