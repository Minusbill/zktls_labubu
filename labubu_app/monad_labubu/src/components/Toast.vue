<template>
  <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white transition-opacity duration-300"
      :class="{
        'bg-blue-9': type === 'info',
        'bg-green-9': type === 'success',
        'bg-red-9': type === 'error'
      }"
  >
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">{{ message }}</span>
      <button
          class="ml-4 text-white hover:text-gray-2 focus:outline-none"
          @click="$emit('close')"
      >
        ✕
      </button>
    </div>
  </div>
</template>

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