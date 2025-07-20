<template>
  <BlindBoxGrid />
</template>

<script>
import BlindBoxGrid from './components/BlindBoxGrid.vue';

export default {
  components: { BlindBoxGrid },
};
</script>

<style>
/* Remove any global styles that might interfere */
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>