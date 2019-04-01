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
        hasmore: {
            type: Boolean,
            value: true
        },
        top:{
            type: String,
            value: '0',
        },
        scrollevent:{
            type: String,
            value: '0',
        }
    },
    data: {

    },
    methods: {
        scrolltolower(e){
            this.triggerEvent('scrolltolower', e)
        },
  
        scrolltoupper(e) {
            this.triggerEvent('scrolltoupper', e)
        },
    }
})
