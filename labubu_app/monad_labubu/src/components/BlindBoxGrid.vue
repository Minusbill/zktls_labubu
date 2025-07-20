<template>
  <div class="grid grid-cols-3 p-4 sm:p-6 lg:p-12 gap-8 sm:gap-12 lg:gap-16 bg-gradient-to-br from-blue-2 to-purple-2 min-h-screen">
    <!-- 左侧：盲盒网格或开奖结果 -->
    <div class="w-[20rem] sm:w-[24rem] lg:w-[32rem] flex flex-col justify-center items-center">
      <!-- 九宫格 -->
      <div v-if="!isCycling && !revealedPrize" class="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-fit mx-auto">
        <button
            v-for="(box, index) in boxes"
            :key="index"
            class="relative w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 bg-white rounded-lg shadow-md cursor-pointer border transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-9/50"
            :class="{
              'border-blue-9 ring-4 ring-blue-9/30': selectedIndex === index,
              'border-gray-3': selectedIndex !== index,
            }"
            @click="selectBox(index)"
            :aria-label="`选择盲盒 ${index + 1}`"
        >
          <img
              v-if="!box.isRevealed"
              :src="backImage"
              alt="盲盒"
              class="object-cover rounded-lg w-full h-full"
              @error="handleImageError"
          />
        </button>
      </div>
      <!-- 开奖动画占位符 -->
      <div v-else-if="isCycling" class="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-fit mx-auto invisible">
        <div
            v-for="(box, index) in boxes"
            :key="index"
            class="relative w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 bg-white rounded-lg border border-gray-3"
        ></div>
      </div>
      <!-- 开奖动画 -->
      <div v-if="isCycling" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div class="relative w-28 sm:w-32 lg:w-36 h-28 sm:h-32 lg:h-36 bg-white rounded-xl shadow-2xl animate-cycle">
          <img
              :src="backImage"
              alt="盲盒动画"
              class="object-cover rounded-xl w-full h-full"
              @error="handleImageError"
          />
        </div>
      </div>
      <!-- 开奖结果 -->
      <div v-else-if="revealedPrize" class="flex justify-center">
        <img
            :src="revealedPrize.image"
            :alt="revealedPrize.name"
            class="object-contain rounded-2xl max-w-[16rem] sm:max-w-[20rem] lg:max-w-[24rem] h-auto transition-transform duration-700 animate-reveal"
            @error="handleImageError"
        />
      </div>
      <!-- 提示信息 -->
      <div v-if="message" class="mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-center text-gray-12 prose prose-sm sm:prose">
        {{ message }}
      </div>
    </div>

    <!-- 中间：空隙 -->
    <div class="w-full"></div>

    <!-- 右侧：盲盒机器界面 -->
    <div class="w-[20rem] sm:w-[24rem] flex flex-col justify-center">
      <div class="bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center text-gray-12 tracking-tight">Labubu 盲盒</h2>
        <div class="text-center mb-10 bg-gray-1 py-8 rounded-lg">
          <p v-if="selectedIndex === null && !revealedPrize && !isCycling" class="text-base sm:text-lg text-gray-7">请选择一个盲盒</p>
          <p v-else-if="!isCycling && !revealedPrize" class="text-base sm:text-lg text-gray-7">已选择 #{{ selectedIndex + 1 }}，准备开启！</p>
          <p v-else-if="isCycling" class="text-base sm:text-lg text-blue-9 font-semibold animate-pulse">盲盒开启中...</p>
          <p v-else class="text-base sm:text-lg text-green-9 font-semibold">请完成验证以领取 Labubu NFT</p>
          <p v-if="isLoggedIn" class="mt-4 text-sm sm:text-base text-gray-8 font-medium">
            已连接钱包: {{ userAddress.slice(0, 6) }}...{{ userAddress.slice(-4) }}
          </p>
        </div>
        <div v-if="!isCycling && !revealedPrize" class="flex justify-center gap-4 sm:gap-6">
          <button
              v-if="selectedIndex !== null"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gray-3 rounded-lg text-base sm:text-lg font-medium text-gray-9 hover:bg-gray-4 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-6"
              @click="cancelSelection"
          >
            取消
          </button>
          <button
              class="px-6 sm:px-8 py-3 sm:py-4 bg-blue-9 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-blue-10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-9/50"
              :disabled="selectedIndex === null"
              @click="startCycle"
          >
            开始
          </button>
        </div>
        <div v-else-if="revealedPrize" class="flex flex-col gap-6 sm:gap-8">
          <div class="flex items-center justify-between">
            <span class="text-base sm:text-lg font-medium" :class="{ 'text-green-9': isLoggedIn, 'text-gray-7': !isLoggedIn }">
              {{ isLoggedIn ? `✔ 已连接钱包` : '1. 连接钱包' }}
            </span>
            <button
                v-if="!isLoggedIn"
                class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-9 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-blue-10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-9/50"
                @click="loginWallet"
            >
              连接
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-base sm:text-lg font-medium" :class="{ 'text-green-9': isTwitterVerified, 'text-gray-7': !isTwitterVerified }">
              {{ isTwitterVerified ? `✔ 已验证Twitter: @${twitterUsername}` : '2. 验证Twitter' }}
            </span>
            <button
                v-if="!isTwitterVerified"
                class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-8 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-blue-9 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-8/50"
                :disabled="!isLoggedIn || isVerifying"
                @click="verifyTwitter"
            >
              {{ isVerifying ? '验证中...' : '验证' }}
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-base sm:text-lg font-medium" :class="{ 'text-green-9': isNFTClaimed, 'text-gray-7': !isNFTClaimed }">
              {{ isNFTClaimed ? `✔ 已领取 Labubu NFT` : '3. 领取你的 Labubu NFT' }}
            </span>
            <button
                v-if="isLoggedIn && isTwitterVerified && !isNFTClaimed"
                class="px-4 sm:px-6 py-2 sm:py-3 bg-green-9 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-green-10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-9/50"
                :disabled="isClaiming"
                @click="claimNFT"
            >
              {{ isClaiming ? '领取中...' : '领取' }}
            </button>
          </div>
          <button
              v-if="isLoggedIn && isTwitterVerified && isNFTClaimed"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-green-9 text-white rounded-lg text-base sm:text-lg font-medium mt-8 hover:bg-green-10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-9/50"
              @click="retryGame"
          >
            再次尝试
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Toast 组件 -->
  <Toast :message="toastMessage" :type="toastType" :visible="toastVisible" @close="toastVisible = false" />
</template>

<script setup>
import { ref } from 'vue';
import { ethers } from 'ethers';
import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk';
import { switchToMonadTestnet } from './config';
import { claimLabubuNFT } from './claim';
import { waitForWallet } from '../utils/walletDetection';
import Toast from './Toast.vue';

// 动态加载图片，并映射 Labubu 到 nftId（0-5）
const images = import.meta.glob('/src/assets/*.png', { eager: true });
const backImage = images['/src/assets/box2.png']?.default || 'https://via.placeholder.com/80?text=盲盒';
const prizes = [
  { name: 'Labubu 1', image: images['/src/assets/labubu1.png']?.default || 'https://via.placeholder.com/500?text=Labubu1', nftId: 0 },
  { name: 'Labubu 2', image: images['/src/assets/labubu2.png']?.default || 'https://via.placeholder.com/500?text=Labubu2', nftId: 1 },
  { name: 'Labubu 3', image: images['/src/assets/labubu3.png']?.default || 'https://via.placeholder.com/500?text=Labubu3', nftId: 2 },
  { name: 'Labubu 4', image: images['/src/assets/labubu4.png']?.default || 'https://via.placeholder.com/500?text=Labubu4', nftId: 3 },
  { name: 'Labubu 5', image: images['/src/assets/labubu5.png']?.default || 'https://via.placeholder.com/500?text=Labubu5', nftId: 4 },
  { name: 'Labubu 6', image: images['/src/assets/labubu6.png']?.default || 'https://via.placeholder.com/500?text=Labubu6', nftId: 5 },
];

// 调试图片加载
console.log('已加载图片:', Object.keys(images));

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
const isNFTClaimed = ref(false);
const isClaiming = ref(false);
const userAddress = ref('');
const twitterUsername = ref('');
const attestationData = ref(null);
const toastMessage = ref('');
const toastType = ref('info'); // info, success, error
const toastVisible = ref(false);
const selectedNftId = ref(null); // 存储选中的 nftId

// 显示 Toast
const showToast = (msg, type = 'info') => {
  toastMessage.value = msg;
  toastType.value = type;
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
};

// Primus ZK-TLS 配置
const appId = "0x88249fdc1a77090ea963b2bef93a13b43a96c21e";
const appSecret = "0x120ef8be875f5be7e0a1be618df1ec96e2eb89eaeb39f3cd3a4b7f4c931f5351";
const primusZKTLS = new PrimusZKTLS();

// 初始化 Primus ZK-TLS
const initPrimus = async () => {
  try {
    if (!appId || !appSecret) {
      throw new Error("appId or appSecret is not set.");
    }
    const initAttestationResult = await primusZKTLS.init(appId, appSecret);
    console.log('Primus 初始化成功:', initAttestationResult);
  } catch (error) {
    console.error('Primus 初始化失败:', error);
    showToast('ZK-TLS 初始化失败，请重试', 'error');
  }
};
initPrimus();

// 选择盲盒
const selectBox = (index) => {
  if (!boxes.value[index].isRevealed && !isCycling.value && !revealedPrize.value) {
    console.log('选择盲盒:', index);
    selectedIndex.value = index;
  }
};

// 开始动画
const startCycle = () => {
  if (selectedIndex.value === null) return;
  isCycling.value = true;
  message.value = '';

  setTimeout(() => {
    revealBox();
    isCycling.value = false;
  }, 2500);
};

// 揭示盲盒结果
const revealBox = () => {
  if (selectedIndex.value === null) return;
  const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
  boxes.value[selectedIndex.value] = {
    ...boxes.value[selectedIndex.value],
    isRevealed: true,
    image: randomPrize.image,
    prize: randomPrize.name,
  };
  revealedPrize.value = randomPrize;
  selectedNftId.value = randomPrize.nftId; // 存储选中的 nftId
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
  isNFTClaimed.value = false;
  userAddress.value = '';
  twitterUsername.value = '';
  attestationData.value = null;
  selectedNftId.value = null; // 重置 nftId
  boxes.value = Array(9)
      .fill()
      .map(() => ({
        isRevealed: false,
        image: '',
        prize: '',
      }));
};

// 连接 MetaMask 或 OKX 钱包并切换到 Monad 测试网
const loginWallet = async () => {
  try {
    if (!window.ethereum) {
      showToast('请安装 MetaMask 或 OKX 钱包！', 'error');
      console.error('未检测到 MetaMask 或 OKX');
      return;
    }

    const walletDetection = await waitForWallet(5000);
    if (!walletDetection.isAvailable || !['MetaMask', 'OKX'].includes(walletDetection.walletType)) {
      showToast('请使用 MetaMask 或 OKX 钱包！', 'error');
      console.error('不支持的钱包:', walletDetection.walletType);
      return;
    }

    const switched = await switchToMonadTestnet();
    if (!switched) {
      showToast('无法切换到 Monad 测试网，请手动切换网络', 'error');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    if (accounts.length > 0) {
      userAddress.value = accounts[0];
      isLoggedIn.value = true;
      showToast(`钱包已连接：${userAddress.value.slice(0, 6)}...${userAddress.value.slice(-4)}`, 'success');
    } else {
      showToast('无法连接钱包，请重试！', 'error');
    }
  } catch (error) {
    showToast('钱包连接失败，请检查 MetaMask 或 OKX 设置！', 'error');
    console.error('钱包连接错误:', error);
  }
};

// Twitter 验证
const verifyTwitter = async () => {
  if (!isLoggedIn.value || !userAddress.value) {
    showToast('请先连接钱包！', 'error');
    return;
  }

  isVerifying.value = true;
  showToast('正在进行 Twitter 验证...', 'info');

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

    request.setAttMode({ algorithmType: "proxytls" });
    const requestStr = request.toJsonString();
    const signedRequestStr = await primusZKTLS.sign(requestStr);
    const attestation = await primusZKTLS.startAttestation(signedRequestStr);

    console.log("attestation", JSON.stringify(attestation));
    const verifyResult = await primusZKTLS.verifyAttestation(attestation);

    if (verifyResult) {
      isTwitterVerified.value = true;
      attestationData.value = attestation;
      const attestationParsed = JSON.parse(attestation.extendedData || '{}');
      twitterUsername.value = attestationParsed.screen_name || 'Unknown';
      showToast(`✅ Twitter 验证成功！用户名: @${twitterUsername.value}`, 'success');
    } else {
      showToast('❌ Twitter 验证失败，请重试', 'error');
    }
  } catch (error) {
    showToast(`验证失败：${error.message || '请重试'}`, 'error');
    console.error('Twitter 验证错误:', error);
  } finally {
    isVerifying.value = false;
  }
};

// 领取 Labubu NFT
const claimNFT = async () => {
  if (!isLoggedIn.value || !isTwitterVerified.value || !userAddress.value || !attestationData.value || selectedNftId.value === null) {
    showToast('请先完成钱包连接、Twitter 验证并选择一个盲盒！', 'error');
    return;
  }

  isClaiming.value = true;
  showToast('正在检测钱包环境...', 'info');

  try {
    const walletDetection = await waitForWallet(5000);
    if (!walletDetection.isAvailable || !['MetaMask', 'OKX'].includes(walletDetection.walletType)) {
      showToast('请使用 MetaMask 或 OKX 钱包！', 'error');
      console.error('不支持的钱包:', walletDetection.walletType);
      return;
    }

    const switched = await switchToMonadTestnet();
    if (!switched) {
      showToast('无法切换到 Monad 测试网，请手动切换网络', 'error');
      return;
    }

    showToast('正在领取 Labubu NFT...', 'info');

    const claimResult = await claimLabubuNFT(
        attestationData.value,
        selectedNftId.value,
        userAddress.value,
        (txHash) => {
          isNFTClaimed.value = true;
          showToast(`🎉 Labubu NFT 领取成功！交易哈希: ${txHash}`, 'success');
        },
        (error) => {
          showToast(error.message, 'error');
          console.error('NFT 领取失败:', error);
        }
    );

    if (!claimResult.success) {
      showToast(claimResult.error, 'error');
    }
  } catch (error) {
    showToast(`NFT 领取失败：${error.message || '请重试'}`, 'error');
    console.error('NFT 领取错误:', error);
  } finally {
    isClaiming.value = false;
  }
};

// 处理图片加载错误
const handleImageError = (event) => {
  console.error('图片加载错误:', event.target.src);
  event.target.src = 'https://via.placeholder.com/500?text=错误';
};
</script>

<style scoped>
@keyframes cycle {
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.2) rotate(8deg);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

@keyframes reveal {
  0% {
    opacity: 0;
    transform: scale(0.7) translate-y-8;
  }
  100% {
    opacity: 1;
    transform: scale(1) translate-y-0;
  }
}

.animate-cycle {
  animation: cycle 0.6s ease-in-out infinite;
}

.animate-reveal {
  animation: reveal 0.8s ease-out forwards;
}
</style>