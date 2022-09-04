---
map:
  path: /pinia
---

# 手写 pinia

```ts | pure
// apis.ts
export function patch(value: any) {
  const store = this;
  for (const key in value) {
    store[key] = value[key];
  }
}
```

```ts | pure
// createActions.ts
export function createActions(store: any, actions: any) {
  for (const method in actions) {
    store[method] = actions[method];
  }
}
```

```ts | pure
// createPinia.ts
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
```

```ts | pure
// defineStore.ts.ts
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
```

```ts | pure
// options/index.ts
import { createState } from './state';
import { createActions } from './actions';
import { createGetters } from './getters';
export { createState, createActions, createGetters };
```

```ts | pure
// options/actions.ts
export function createActions(store: any, actions: any) {
  for (const method in actions) {
    store[method] = actions[method];
  }
}
```

```ts | pure
// options/getters.ts
import { computed } from 'vue';

export function createGetters(store: any, getters: any) {
  for (const getter in getters) {
    store[getter] = computed(getters[getter].bind(store.$state, store.$state));
    store.$state[getter] = store[getter];
  }
}
```

```ts | pure
// options/state.ts
import { reactive, toRef } from 'vue';

export function createState(store: any, state: any) {
  const _state: any = state();
  store.$state = reactive(_state);
  for (const key in _state) {
    store[key] = toRef(store.$state, key);
  }
}
```
