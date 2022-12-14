---
map:
  path: /hoc
---

# VueHOC

## Vue3

- utils.tsx

```tsx | pure
import { reactive, onMounted, unref, defineComponent, watch } from 'vue';
/**
 * HOC Component transform function
 * @param {(params: any) => Promise<any>} promiseFn
 * @param {Object} params
 */
const usePromiseFetch = (
  promiseFn: (params: any) => Promise<any>,
  params = {},
) => {
  const obj = reactive<{ result: null | {}; error: boolean; loading: boolean }>(
    {
      result: null,
      error: false,
      loading: false,
    },
  );

  const fetchRequest = async (params) => {
    obj.loading = true;
    const result = await promiseFn(params).finally(() => {
      obj.loading = false;
    });
    obj.result = result;
  };

  /**
   * @param {JSX.IntrinsicElements | any} Wrapped
   */
  return function wrap(Wrapped: JSX.IntrinsicElements | any) {
    onMounted(() => fetchRequest(params));
    watch(params, (newVal) => fetchRequest(newVal), { immediate: true });

    const NewWrapped = defineComponent<InstanceType<typeof Wrapped>>({
      setup(props, ctx) {
        return {
          slots: ctx.slots,
          attrs: ctx.attrs,
          props,
          this: this,
        };
      },
      render() {
        if (obj.loading) return <span>loading...</span>;
        if (obj.error) return <span>error...</span>;
        return (
          <Wrapped
            slots={this.slots}
            attrs={this.attrs}
            props={this.props}
            loading={unref(obj.loading)}
            result={unref(obj.result)}
          />
        );
      },
    });
    return NewWrapped;
  };
};

function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T extends any>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

function normalizeProps(vm) {
  return {
    on: vm.$listeners,
    attr: vm.$attrs,
    scopedSlots: vm.$scopedSlots,
  };
}

const WithLog = (Wrapped: JSX.IntrinsicElements | any) => {
  return defineComponent({
    mounted() {
      console.log('log');
    },
    render() {
      const props = normalizeProps(this);
      return <Wrapped {...props} />;
    },
  });
};

export { usePromiseFetch, compose, WithLog };
```

- View.vue

```tsx | pure
<template>
  <div>
    <span>{{ result?.name }}</span>
  </div>
</template>
<script setup lang="tsx">
  import { useSlots, useAttrs } from 'vue';
  const { result, loading } = defineProps(['result', 'loading']);

  const slots = useSlots();
  const attrs = useAttrs();
  defineExpose({
    slots,
    attrs,
  });
</script>
```

- index.vue

```html | pure
<template> <HOC /></template>
<script setup lang="tsx">
  import { compose, usePromiseFetch, WithLog } from './utils';
  import View from './View.vue';

  const params = { id: 10 };

  const request = (params = {}) => {
    // mock the fetch
    // parmas is the params of the request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: 'ssh' });
      }, 1000);
    });
  };

  // const HOC = usePromiseFetch(View, request, params);
  // const HOC = WithLog(usePromiseFetch(View, request, params));
  const composed = compose(usePromiseFetch(request), WithLog);
  const HOC = composed(View);
</script>
```

## vue2

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hoc-promise</title>
  </head>
  <body>
    <div id="app">
      <hoc msg="msg" @change="onChange">
        <template>
          <div>I am slot</div>
        </template>
        <template v-slot:named>
          <div>I am named slot</div>
        </template>
      </hoc>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.7.10"></script>
    <script>
      var view = {
        props: ['result'],
        data() {
          return {
            requestParams: {
              name: 'ssh',
            },
          };
        },
        methods: {
          reload() {
            this.requestParams = {
              name: 'changed!!',
            };
          },
        },
        template: `
          <span>
            <span>{{result?.name}}</span>
            <slot></slot>
            <slot name="named"></slot>
            <button @click="reload">??????????????????</button>
          </span>
        `,
      };

      const withPromise = (promiseFn) => {
        return function (wrapped) {
          return {
            data() {
              return {
                loading: false,
                error: false,
                result: null,
              };
            },
            methods: {
              async request() {
                this.loading = true;
                // ?????????????????????????????????
                const { requestParams } = this.$refs.wrapped;
                // ?????????????????????
                const result = await promiseFn(requestParams).finally(() => {
                  this.loading = false;
                });
                this.result = result;
              },
            },
            async mounted() {
              // ?????????????????????????????????????????????????????????
              this.$refs.wrapped.$watch(
                'requestParams',
                this.request.bind(this),
                {
                  immediate: true,
                },
              );
            },
            render(h) {
              const args = {
                props: {
                  // ?????? $attrs
                  ...this.$attrs,
                  result: this.result,
                  loading: this.loading,
                },

                // ????????????
                on: this.$listeners,

                // ?????? $scopedSlots
                scopedSlots: this.$scopedSlots,
                ref: 'wrapped',
              };

              const wrapper = h('div', [
                this.loading ? h('span', ['???????????????']) : null,
                this.error ? h('span', ['????????????']) : null,
                h(wrapped, args),
              ]);

              return wrapper;
            },
          };
        };
      };

      const withLog = (wrapped) => {
        return {
          mounted() {
            console.log('I am mounted!');
          },
          render(h) {
            return h(wrapped, normalizeProps(this));
          },
        };
      };

      const request = (data) => {
        return new Promise((r) => {
          setTimeout(() => {
            r(data);
          }, 1000);
        });
      };

      const composed = compose(withLog, withPromise(request));

      var hoc = composed(view);

      new Vue({
        el: '#app',
        components: {
          hoc,
        },
        methods: {
          onChange() {},
        },
      });

      function compose(...funcs) {
        return funcs.reduce((a, b) => (...args) => a(b(...args)));
      }

      function normalizeProps(vm) {
        return {
          on: vm.$listeners,
          attr: vm.$attrs,
          // ?????? $scopedSlots
          scopedSlots: vm.$scopedSlots,
        };
      }
    </script>
  </body>
</html>
```
