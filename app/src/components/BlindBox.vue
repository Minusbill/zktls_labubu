<template>
  <div 
    :class="[
      'relative w-full aspect-square cursor-pointer bounce-in',
      isSelected && 'pointer-events-none'
    ]"
    :style="{ animationDelay: `${delay}ms` }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <!-- 主盒子 -->
    <div :class="[
      'relative w-full h-full rounded-3xl labubu-box overflow-hidden transition-all duration-300',
      isHovered && 'float scale-110 rotate-1',
      isClicked && 'animate-pulse',
      isSelected && 'labubu-glow ring-4 ring-pink-400/60 shadow-pink-300'
    ]">
      <!-- 盒子正面 - 显示盲盒图片 -->
      <div class="absolute inset-0">
        <img
          :src="boxImage"
          alt="盲盒"
          class="w-full h-full object-cover rounded-3xl group-hover:brightness-110 transition-all duration-300"
          @error="handleImageError"
        />
        
        <!-- 悬停时的装饰层 -->
        <div v-if="isHovered || isSelected" class="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm">
          <!-- 装饰图标 -->
          <div :class="[
            'mb-4 p-3 rounded-full bg-gradient-to-br from-white/90 to-gray-100/90 transition-all duration-300 shadow-lg',
            isHovered && 'scale-110 rotate-12',
            isSelected && 'scale-125 sparkle animate-bounce'
          ]">
            <component 
              :is="iconComponent" 
              :class="[
                'w-8 h-8 transition-all duration-300',
                iconColor,
                isSelected && 'animate-pulse'
              ]" 
            />
          </div>

          <!-- 礼物图标 -->
          <div :class="[
            'relative mb-4 transition-transform duration-300',
            isHovered && 'scale-110',
            isSelected && 'animate-bounce'
          ]">
            <Gift :class="[
              'w-12 h-12 text-gradient-to-r from-pink-300 to-purple-300 drop-shadow-lg transition-all duration-300',
              isSelected && 'text-yellow-300 animate-pulse'
            ]" />
            
            <!-- 闪光效果 -->
            <div 
              v-if="isHovered || isSelected"
              class="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-300/40 to-purple-300/40 animate-ping" 
            />
          </div>

          <!-- 盒子编号 -->
          <div :class="[
            'text-lg font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg transition-all duration-300',
            isHovered && 'scale-110',
            isSelected && 'from-yellow-200 to-orange-200 animate-pulse'
          ]">
            #{{ id.toString().padStart(2, '0') }}
          </div>

          <!-- 提示文字 -->
          <div :class="[
            'text-xs mt-2 font-medium drop-shadow transition-all duration-300',
            isSelected ? 'text-yellow-200 animate-pulse' : 'text-white/90'
          ]">
            {{ isSelected ? '🎯 已选择!' : '✨ 点击选择' }}
          </div>
        </div>
      </div>

      <!-- 边框装饰 -->
      <div :class="[
        'absolute inset-0 rounded-3xl border-3 transition-all duration-300',
        isSelected ? 'border-pink-400 shadow-lg shadow-pink-200' : 'border-white/30'
      ]" />
      
      <!-- 光泽效果 -->
      <div class="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-sm animate-pulse" />
      
      <!-- 选中后的特效 -->
      <template v-if="isSelected">
        <!-- 闪烁星星 -->
        <div
          v-for="i in 8"
          :key="i"
          :class="[
            'absolute w-3 h-3 rounded-full sparkle opacity-80',
            (i - 1) % 3 === 0 ? 'bg-yellow-400 animate-ping' : 
            (i - 1) % 3 === 1 ? 'bg-pink-400 animate-pulse' : 'bg-purple-400 animate-bounce'
          ]"
          :style="{
            top: `${15 + ((i - 1) * 10)}%`,
            left: `${10 + ((i - 1) * 11)}%`,
            animationDelay: `${(i - 1) * 150}ms`
          }"
        />
        <!-- 魔法光环 -->
        <div class="absolute inset-2 rounded-3xl border-2 border-gradient-to-r from-pink-300 via-purple-300 to-blue-300 animate-spin" style="animation-duration: 3s;"></div>
      </template>
    </div>

    <!-- 悬停时的外部光晕 -->
    <div 
      v-if="isHovered"
      class="absolute -inset-4 bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-blue-300/20 rounded-3xl blur-xl animate-pulse" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Gift, Star, Heart, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  boxImage: {
    type: String,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select'])

const isHovered = ref(false)
const isClicked = ref(false)

const decorativeIcons = [
  { Icon: Star, color: 'text-yellow-500' },
  { Icon: Heart, color: 'text-pink-500' },
  { Icon: Sparkles, color: 'text-purple-500' },
]

const randomIcon = computed(() => decorativeIcons[props.id % decorativeIcons.length])
const iconComponent = computed(() => randomIcon.value.Icon)
const iconColor = computed(() => randomIcon.value.color)

const handleClick = () => {
  if (!props.isSelected) {
    isClicked.value = true
    setTimeout(() => {
      emit('select', props.id)
    }, 300)
  }
}

const handleImageError = (event) => {
  console.error('图片加载错误:', event.target.src)
  event.target.src = 'https://via.placeholder.com/200x200?text=错误'
}
</script>

<style scoped>
/* Labubu 盒子基础样式 */
.labubu-box {
  box-shadow: 
    0 15px 35px rgba(236, 72, 153, 0.15),
    0 10px 20px rgba(168, 85, 247, 0.1),
    0 5px 15px rgba(59, 130, 246, 0.08);
  background: linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #eff6ff 100%);
}

/* Labubu 光晕效果 */
.labubu-glow {
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 0.5),
    0 0 80px rgba(168, 85, 247, 0.3),
    0 0 120px rgba(59, 130, 246, 0.2),
    0 15px 35px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px) scale(1.05);
}

.bounce-in {
  animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.float {
  animation: float 4s ease-in-out infinite;
}

.sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3) translateY(-50px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translateY(-10px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-8px) rotate(1deg);
  }
  66% {
    transform: translateY(-4px) rotate(-1deg);
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
  }
}

/* 彩虹渐变边框 */
.border-gradient-to-r {
  border-image: linear-gradient(to right, #ec4899, #a855f7, #3b82f6) 1;
}
</style>