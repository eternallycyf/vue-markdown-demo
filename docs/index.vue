<template>
  <v-typical
    class="blink"
    :steps="[
      '所有晦暗都留给过往，从遇见你开始，凛冬散尽，星河长明！🎉 🎉 🎉',
      1000,
    ]"
    :loop="Infinity"
    :wrapper="'h2'"
  ></v-typical>
</template>

<script lang="ts">
import VTypical from './VTypical';

export default {
  components: {
    VTypical,
  },
};
</script>

<style>
.blink::after {
  content: '|';
  animation: blink 1s infinite step-start;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
