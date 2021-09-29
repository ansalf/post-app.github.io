import Vue from 'vue'
import App from './App.vue'
//router
import VueRouter from "vue-router";
import router from "./router";

Vue.config.productionTip = false
Vue.useAttrs(VueRouter);

//add global styles

new Vue({
    router,
    render:h => h(App),
}).$mount('#app')
