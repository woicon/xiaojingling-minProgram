// components/reportDetail/detail.js
Component({
    properties: {
        details: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer: "_changeDetail"
        },
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
