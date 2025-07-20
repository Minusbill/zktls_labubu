<template>
  <div
      v-if="visible"
      class="fixed top-6 right-6 z-50 max-w-sm p-5 rounded-2xl shadow-2xl text-white transition-all duration-500 transform animate-slide-in border border-white/20 backdrop-blur-sm"
      :class="{
        'bg-gradient-to-r from-blue-500 to-purple-600': type === 'info',
        'bg-gradient-to-r from-green-500 to-emerald-600': type === 'success',
        'bg-gradient-to-r from-red-500 to-pink-600': type === 'error'
      }"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <span v-if="type === 'info'" class="text-2xl">💬</span>
          <span v-else-if="type === 'success'" class="text-2xl">✅</span>
          <span v-else-if="type === 'error'" class="text-2xl">❌</span>
        </div>
        <span class="text-sm font-medium leading-relaxed">{{ message }}</span>
      </div>
      <button
          class="ml-4 text-white/80 hover:text-white focus:outline-none transition-colors duration-200 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
          @click="$emit('close')"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>

<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: 'info'
  },
  visible: Boolean
});

defineEmits(['close']);
</script>