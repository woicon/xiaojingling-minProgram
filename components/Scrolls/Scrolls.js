// components/Scrolls/Scrolls.js
Component({
    properties: {
        listloading:{
            type:Boolean,
            value:true
        },
        istolower:{
            type: Boolean,
            value: false
        },
        istoupper: {
            type: Boolean,
            value: false
        },
        top:{
            type: String,
            value: '0',
        }
    },
    data: {

    },
    attached() {
        console.log("ss")
    },
    created() {
        console.log("created:::")
    },
    lifetimes:{
        attached(){
            console.log("ss")
        },
        created(){
            console.log("created:::")
        }
    },
    attached(e) {
        console.log("ssttt")
    },
    created() {
        console.log("created:::")
    },
    methods: {
        scrolltolower(e){
            this.setData({
                istolower:true,
                hasmore: true
            })
            this.triggerEvent('scrolltoLower', e)
        },
        scrolltoupper(e) {
            this.setData({
                istoupper: true,
                refreshing:true
            })
            this.triggerEvent('scrolltoupper', e)
        },
    }
})
