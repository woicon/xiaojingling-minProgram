// components/Contents/Contents.js
Component({
    properties: {
        loading:{
            type:Boolean,
            value:true
        },
        loadingcolor:{
            type: String,
            value: '#cccccc'
        },
        error:{
            type: Boolean,
            value: false
        },
        errorMsg:{
            type: String,
            value: ''
        },
        icon:{
            type:String,
            value:'icon-orders'
        }
    },
    data: {

    },
    methods: {
    }
})
