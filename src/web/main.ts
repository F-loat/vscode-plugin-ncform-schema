import Vue from 'vue';
import { Drawer } from 'element-ui';
import VSCodePlugin from './plugins/vscode';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(VSCodePlugin);
Vue.component(Drawer.name, Drawer);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
