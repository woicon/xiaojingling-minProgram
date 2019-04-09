Component({
    properties: {
        details: {
            type: Array,
            value: [],
            observer: "_changeDetail"
        }
    },
    data: {
        currIndex: null
    },
    options: {
        addGlobalClass: true,
    },
    methods: {
        _toggleDetail: function(e) {
            let currIndex = e.currentTarget.dataset.index == this.data.currIndex ? null : e.currentTarget.dataset.index
            this.setData({
                currIndex: currIndex
            })
        },
        _changeDetail: function(newData, oldData) {
            this.setData({
                detail: newData,
            })
        }
    }
})