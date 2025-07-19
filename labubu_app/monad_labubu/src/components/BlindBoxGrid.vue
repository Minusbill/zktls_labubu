<template>
  <div class="flex p-12 gap-24 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
    <!-- 左侧：盲盒网格或开奖结果 -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- 九宫格：未开始动画且未揭示奖品时显示 -->
      <div v-if="!isCycling && !revealedPrize" class="grid grid-cols-3 gap-4 w-fit mx-auto">
        <div
            v-for="(box, index) in boxes"
            :key="index"
            class="relative w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-2xl cursor-pointer border"
            :class="{
            'border-blue-600 ring-4 ring-blue-300/50': selectedIndex === index,
            'border-gray-300': selectedIndex !== index,
          }"
            @click="selectBox(index)"
        >
          <img
              v-if="!box.isRevealed"
              :src="backImage"
              alt="盲盒"
              class="object-cover rounded-2xl w-full h-full"
              @error="handleImageError"
          />
        </div>
      </div>
      <!-- 开奖动画占位符：保持九宫格空间 -->
      <div v-else-if="isCycling" class="grid grid-cols-3 gap-4 w-fit mx-auto invisible">
        <div
            v-for="(box, index) in boxes"
            :key="index"
            class="relative w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-2xl border border-gray-300"
        ></div>
      </div>
      <!-- 开奖动画：显示在屏幕中间 -->
      <div v-if="isCycling" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div class="relative w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl animate-cycle">
          <img
              :src="backImage"
              alt="盲盒动画"
              class="object-cover rounded-2xl w-full h-full"
              @error="handleImageError"
          />
        </div>
      </div>
      <!-- 开奖结果：显示抽中的奖品 -->
      <div v-else-if="revealedPrize" class="flex justify-center">
        <img
            :src="revealedPrize.image"
            :alt="revealedPrize.name"
            class="object-contain rounded-3xl max-w-lg h-auto transition-transform duration-700 animate-reveal"
            @error="handleImageError"
        />
      </div>
      <!-- 提示信息 -->
      <div v-if="message" class="mt-10 text-xl font-semibold text-center text-gray-900">
        {{ message }}
      </div>
    </div>

    <!-- 右侧：盲盒机器界面 -->
    <div class="w-[28rem] flex flex-col justify-center">
      <div class="bg-gradient-to-b from-gray-100 to-gray-200 p-12 rounded-3xl shadow-lg">
        <h2 class="text-3xl font-bold mb-16 text-center text-gray-900 tracking-tight">盲盒机器</h2>
        <div class="text-center mb-24 bg-gray-50 py-10 rounded-xl">
          <p v-if="selectedIndex === null && !revealedPrize && !isCycling" class="text-lg text-gray-600">请选择一个盲盒</p>
          <p v-else-if="!isCycling && !revealedPrize" class="text-lg text-gray-600">已选 #{{ selectedIndex + 1 }}，准备开启！</p>
          <p v-else-if="isCycling" class="text-lg text-blue-600 font-semibold animate-pulse">盲盒开启中...</p>
          <p v-else class="text-lg text-green-600 font-semibold">完成 Twitter 验证以继续</p>
          <!-- 显示钱包地址 -->
          <p v-if="isLoggedIn" class="mt-4 text-sm text-gray-800 font-medium">
            已连接钱包: {{ userAddress.slice(0, 6) }}...{{ userAddress.slice(-4) }}
          </p>
        </div>
        <div v-if="!isCycling && !revealedPrize" class="flex modulate justify-center gap-8">
          <button
              v-if="selectedIndex !== null"
              class="px-6 py-3 bg-gray-300 rounded-xl text-lg text-gray-800 font-medium hover:bg-gray-400 transition-colors"
              @click="cancelSelection"
          >
            取消
          </button>
          <button
              class="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
              :disabled="selectedIndex === null"
              @click="startCycle"
          >
            开始
          </button>
        </div>
        <div v-else-if="revealedPrize" class="flex flex-col gap-20">
          <div class="flex items-center gap-6">
            <span class="text-lg font-medium" :class="{ 'text-green-600': isLoggedIn, 'text-gray-600': !isLoggedIn }">
              {{ isLoggedIn ? `✔ 已登录钱包` : '1. 登录钱包' }}
            </span>
            <button
                v-if="!isLoggedIn"
                class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                @click="loginWallet"
            >
              登录
            </button>
          </div>
          <div class="flex items-center gap-6">
            <span class="text-lg font-medium" :class="{ 'text-green-600': isTwitterVerified, 'text-gray-600': !isTwitterVerified }">
              {{ isTwitterVerified ? '✔ 已验证 Twitter' : '2. 验证 Twitter' }}
            </span>
            <button
                v-if="!isTwitterVerified"
                class="px-4 py-2 bg-blue-400 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
                :disabled="!isLoggedIn || isVerifying"
                @click="verifyTwitter"
            >
              {{ isVerifying ? '验证中...' : '验证' }}
            </button>
          </div>
          <button
              v-if="isLoggedIn && isTwitterVerified"
              class="px-6 py-3 bg-green-600 text-white rounded-xl text-lg font-medium mt-16 hover:bg-green-700 transition-colors"
              @click="retryGame"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ethers } from 'ethers';
import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk';

// 动态加载图片
const images = import.meta.glob('/src/assets/*.png', { eager: true });
const backImage = images['/src/assets/box2.png']?.default || 'https://via.placeholder.com/64?text=Box';
const prizes = [
  { name: 'Labubu 1', image: images['/src/assets/labubu1.png']?.default || 'https://via.placeholder.com/500?text=Labubu1' },
  { name: 'Labubu 2', image: images['/src/assets/labubu2.png']?.default || 'https://via.placeholder.com/500?text=Labubu2' },
  { name: 'Labubu 3', image: images['/src/assets/labubu3.png']?.default || 'https://via.placeholder.com/500?text=Labubu3' },
  { name: 'Labubu 4', image: images['/src/assets/labubu4.png']?.default || 'https://via.placeholder.com/500?text=Labubu4' },
  { name: 'Labubu 5', image: images['/src/assets/labubu5.png']?.default || 'https://via.placeholder.com/500?text=Labubu5' },
  { name: 'Labubu 6', image: images['/src/assets/labubu6.png']?.default || 'https://via.placeholder.com/500?text=Labubu6' },
];

// 调试图片加载
console.log('Loaded images:', Object.keys(images));

// 状态定义
const boxes = ref(
    Array(9)
        .fill()
        .map(() => ({
          isRevealed: false,
          image: '',
          prize: '',
        }))
);
const selectedIndex = ref(null);
const message = ref('');
const isCycling = ref(false);
const revealedPrize = ref(null);
const isLoggedIn = ref(false);
const isTwitterVerified = ref(false);
const isVerifying = ref(false);
const userAddress = ref(null);

// Primus ZK-TLS 配置
const appId = "0x4bf0468034fd3e9cc4678915f25b253351c5a3ef";
const appSecret = "0xe37b6e481d80c537838f7b16e7fe70bd9d48a7326f32c0eaabdd1c82074c819a";
const primusZKTLS = new PrimusZKTLS();

// 初始化 Primus ZK-TLS
const initPrimus = async () => {
  try {
    const initAttestationResult = await primusZKTLS.init(appId, appSecret);
    console.log('Primus init result:', initAttestationResult);
  } catch (error) {
    console.error('Primus initialization failed:', error);
    message.value = 'ZK-TLS 初始化失败，请重试';
  }
};

// 在组件挂载时初始化 Primus
initPrimus();

// 选择盲盒
const selectBox = (index) => {
  if (!boxes.value[index].isRevealed && !isCycling.value && !revealedPrize.value) {
    console.log('Box clicked:', index);
    selectedIndex.value = index;
  }
};

// 开始动画
const startCycle = () => {
  if (selectedIndex.value === null) return;
  isCycling.value = true;
  message.value = '';

  // 模拟动画，2.5秒后揭示结果
  setTimeout(() => {
    revealBox();
    isCycling.value = false;
  }, 2500);
};

// 揭示盲盒结果
const revealBox = () => {
  if (selectedIndex.value === null) return;
  console.log('Revealing box:', selectedIndex.value);
  const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
  boxes.value[selectedIndex.value] = {
    ...boxes.value[selectedIndex.value],
    isRevealed: true,
    image: randomPrize.image,
    prize: randomPrize.name,
  };
  revealedPrize.value = {
    name: randomPrize.name,
    image: randomPrize.image,
  };
  message.value = `恭喜！抽到 ${randomPrize.name}！`;
  selectedIndex.value = null;
};

// 取消选择
const cancelSelection = () => {
  selectedIndex.value = null;
  message.value = '';
};

// 重试游戏
const retryGame = () => {
  revealedPrize.value = null;
  selectedIndex.value = null;
  message.value = '';
  isLoggedIn.value = false;
  isTwitterVerified.value = false;
  userAddress.value = null;
  boxes.value = Array(9)
      .fill()
      .map(() => ({
        isRevealed: false,
        image: '',
        prize: '',
      }));
};

// 使用 ethers.js v5 连接 MetaMask 登录钱包
const loginWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      message.value = '请安装 MetaMask 钱包！';
      console.error('MetaMask not installed');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    if (accounts.length > 0) {
      userAddress.value = accounts[0];
      isLoggedIn.value = true;
      console.log('Wallet connected, address:', userAddress.value);
      message.value = `钱包已连接：${userAddress.value.slice(0, 6)}...${userAddress.value.slice(-4)}`;
    } else {
      message.value = '未能获取钱包地址，请重试！';
      console.error('No accounts returned from MetaMask');
    }
  } catch (error) {
    message.value = '钱包连接失败，请检查 MetaMask 设置！';
    console.error('Error connecting to MetaMask:', error);
  }
};

// Twitter 验证（基于 Primus ZK-TLS）
const verifyTwitter = async () => {
  if (!isLoggedIn.value || !userAddress.value) {
    message.value = '请先连接钱包！';
    return;
  }

  isVerifying.value = true;
  message.value = '正在进行 ZK-TLS Twitter 验证...';

  try {
    const attTemplateID = "2e3160ae-8b1e-45e3-8c59-426366278b9d";
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress.value);
    request.setAttConditions([
      [
        {
          type: "CONDITION_EXPANSION",
          op: "MATCH_ONE",
          key: "login",
          field: "$[0].data.currentUser.subscriptionBenefits.edges[*]+",
          value: [
            {
              type: "FIELD_RANGE",
              op: "STREQ",
              field: "+.node.user.login",
            },
          ],
        },
      ],
    ]);

    request.setAttMode({
      algorithmType: "proxytls",
    });

    const requestStr = request.toJsonString();
    const signedRequestStr = await primusZKTLS.sign(requestStr);
    const attestation = await primusZKTLS.startAttestation(signedRequestStr);
    console.log('Attestation:', attestation);

    const verifyResult = await primusZKTLS.verifyAttestation(attestation);
    console.log('Verify result:', verifyResult);

    if (verifyResult) {
      isTwitterVerified.value = true;
      isVerifying.value = false;
      message.value = '✅ Twitter 验证成功！';
      console.log('🎉 Twitter verification successful!');
    } else {
      isVerifying.value = false;
      message.value = '❌ Twitter 验证失败，请重试';
      console.error('Twitter verification failed');
    }
  } catch (error) {
    isVerifying.value = false;
    message.value = '验证失败：' + (error.message || '请重试');
    console.error('Twitter verification error:', error);
  }
};

// 处理图片加载错误
const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.src = 'https://via.placeholder.com/500?text=Error';
};
</script>

<style scoped>
@keyframes cycle {
  0% {
    transform: scale(1) rotate(0deg);
    background: linear-gradient(145deg, #ffffff, #e5e7eb);
  }
  50% {
    transform: scale(1.3) rotate(10deg);
    background: linear-gradient(145deg, #fef08a, #fde047);
  }
  100% {
    transform: scale(1) rotate(0deg);
    background: linear-gradient(145deg, #ffffff, #e5e7eb);
  }
}

@keyframes reveal {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-cycle {
  animation: cycle 0.5s infinite;
}

.animate-reveal {
  animation: reveal 0.7s ease-out forwards;
}
</style>