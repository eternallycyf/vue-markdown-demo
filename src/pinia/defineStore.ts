import { reactive, inject } from 'vue';
import { createState, createActions, createGetters } from './options';

export default (name: any, { state, getters, actions }: any) => {
  const store: any = {};

  state && typeof state === 'function' && createState(store, state);
  actions && Object.keys(actions).length > 0 && createActions(store, actions);
  getters && Object.keys(getters).length > 0 && createGetters(store, getters);

  return () => {
    const setSubStore: any = inject('setSubStore');
    const piniaStore = setSubStore(name, reactive(store));
    return piniaStore[name];
  };
};
