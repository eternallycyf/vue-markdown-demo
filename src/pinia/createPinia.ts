import { reactive } from 'vue';
import { patch } from './apis';

export default () => {
  const piniaStore = reactive<any>({});
  function setSubStore(name: string, store: any) {
    if (!piniaStore[name]) {
      piniaStore[name] = store;
      piniaStore[name].$patch = patch;
    }
    return piniaStore;
  }

  function install(app: any) {
    app.provide('setSubStore', setSubStore);
  }
  return {
    install,
  };
};
