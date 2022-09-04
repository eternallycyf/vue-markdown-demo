import { reactive, toRef } from 'vue';

export function createState(store: any, state: any) {
  const _state: any = state();
  store.$state = reactive(_state);
  for (const key in _state) {
    store[key] = toRef(store.$state, key);
  }
}
