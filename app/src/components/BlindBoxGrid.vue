<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0">
      <div class="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 tracking-tight">
          🎁 Labubu Mystery Box
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Unlock exclusive Labubu NFTs through our innovative ZK-TLS powered mystery box experience
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Zero-Knowledge Verification</span>
          </div>
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span>Blockchain Secured</span>
          </div>
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span>Limited Edition NFTs</span>
          </div>
        </div>
      </div>

      <!-- Main Game Area -->
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-12 items-start">
          
          <!-- Left: How it Works -->
          <div class="lg:order-1 space-y-6">
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
                <span class="text-4xl mr-3">🎯</span>
                How It Works
              </h2>
              <div class="space-y-4">
                <div class="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20">
                  <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h3 class="text-white font-semibold mb-1">Choose Your Box</h3>
                    <p class="text-gray-300 text-sm">Select from 6 mystery boxes, each containing a unique Labubu NFT</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h3 class="text-white font-semibold mb-1">Connect Wallet</h3>
                    <p class="text-gray-300 text-sm">Link your MetaMask or OKX wallet to the Monad testnet</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h3 class="text-white font-semibold mb-1">Verify Identity</h3>
                    <p class="text-gray-300 text-sm">Complete ZK-TLS Twitter verification for security</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-yellow-500/20">
                  <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h3 class="text-white font-semibold mb-1">Claim Your NFT</h3>
                    <p class="text-gray-300 text-sm">Mint your exclusive Labubu NFT to your wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Center: Mystery Boxes -->
          <div class="lg:order-2 flex flex-col items-center space-y-8">
            <!-- Mystery Box Grid -->
            <div v-if="!isCycling && !revealedPrize" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 class="text-2xl font-bold text-white text-center mb-6">🎁 Choose Your Mystery Box</h3>
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="(box, index) in boxes"
                  :key="index"
                  class="relative w-24 h-24 group transition-all duration-300 hover:scale-110"
                  :class="{
                    'scale-110 z-10': selectedIndex === index,
                  }"
                  @click="selectBox(index)"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                  <div 
                    class="relative w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-xl border-4 transition-all duration-300"
                    :class="{
                      'border-yellow-400 shadow-yellow-400/50': selectedIndex === index,
                      'border-white group-hover:border-pink-300': selectedIndex !== index,
                    }"
                  >
                    <img
                      v-if="!box.isRevealed"
                      :src="backImage"
                      alt="Mystery Box"
                      class="object-cover rounded-xl w-full h-full"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-gray-600">{{ index + 1 }}</span>
                    </div>
                    <div v-if="selectedIndex === index" class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <span class="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Opening Animation -->
            <div v-if="isCycling" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div class="text-center">
                <div class="relative w-40 h-40 mb-8">
                  <div class="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl animate-spin"></div>
                  <div class="absolute inset-2 bg-white rounded-2xl flex items-center justify-center">
                    <img
                      :src="backImage"
                      alt="Opening..."
                      class="w-20 h-20 object-cover rounded-xl animate-pulse"
                      @error="handleImageError"
                    />
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-4">🎪 Opening Your Mystery Box...</h3>
                <div class="flex justify-center space-x-2">
                  <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                  <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                  <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                </div>
              </div>
            </div>

            <!-- Revealed Prize -->
            <div v-if="revealedPrize" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
              <h3 class="text-3xl font-bold text-white mb-6">🎉 Congratulations!</h3>
              <div class="relative inline-block">
                <div class="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                <img
                  :src="revealedPrize.image"
                  :alt="revealedPrize.name"
                  class="relative w-48 h-48 object-cover rounded-3xl shadow-2xl"
                  @error="handleImageError"
                />
              </div>
              <h4 class="text-2xl font-bold text-yellow-400 mt-6 mb-2">{{ revealedPrize.name }}</h4>
              <p class="text-gray-300">Your exclusive Labubu NFT awaits!</p>
            </div>

            <!-- Status Message -->
            <div v-if="message" class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30">
              <p class="text-yellow-200 font-medium text-center">{{ message }}</p>
            </div>
          </div>

          <!-- Right: Action Panel -->
          <div class="lg:order-3 space-y-6">
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 class="text-3xl font-bold text-white text-center mb-8">
                <span class="text-4xl block mb-2">🎮</span>
                Game Control
              </h2>

              <!-- Game Controls -->
              <div v-if="!isCycling && !revealedPrize" class="space-y-4">
                <div class="text-center p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                  <p v-if="selectedIndex === null" class="text-purple-200 text-lg font-medium">
                    ✨ Select a mystery box to begin your adventure
                  </p>
                  <p v-else class="text-purple-200 text-lg font-medium">
                    🎯 Box #{{ selectedIndex + 1 }} selected - Ready to open!
                  </p>
                  <p v-if="isLoggedIn" class="mt-3 text-sm text-green-300 bg-green-500/20 px-3 py-1 rounded-full inline-block">
                    🔗 Wallet Connected: {{ userAddress.slice(0, 6) }}...{{ userAddress.slice(-4) }}
                  </p>
                </div>
                
                <div class="flex gap-3">
                  <button
                    v-if="selectedIndex !== null"
                    class="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    @click="cancelSelection"
                  >
                    🔄 Reset
                  </button>
                  <button
                    class="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    :disabled="selectedIndex === null"
                    @click="startCycle"
                  >
                    🚀 Open Box
                  </button>
                </div>
              </div>

              <!-- Verification Steps -->
              <div v-if="revealedPrize" class="space-y-4">
                <!-- Wallet Connection -->
                <div class="p-4 rounded-2xl border-2 transition-all duration-300" :class="{ 'bg-green-500/20 border-green-400': isLoggedIn, 'bg-gray-500/20 border-gray-400': !isLoggedIn }">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{ 'bg-green-500': isLoggedIn, 'bg-gray-500': !isLoggedIn }">
                        <span class="text-white text-sm">{{ isLoggedIn ? '✓' : '1' }}</span>
                      </div>
                      <span class="font-semibold" :class="{ 'text-green-300': isLoggedIn, 'text-gray-300': !isLoggedIn }">
                        {{ isLoggedIn ? '✅ Wallet Connected' : '💼 Connect Wallet' }}
                      </span>
                    </div>
                    <button
                      v-if="!isLoggedIn"
                      class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      @click="loginWallet"
                    >
                      Connect
                    </button>
                  </div>
                </div>

                <!-- Twitter Verification -->
                <div class="p-4 rounded-2xl border-2 transition-all duration-300" :class="{ 'bg-green-500/20 border-green-400': isTwitterVerified, 'bg-gray-500/20 border-gray-400': !isTwitterVerified }">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{ 'bg-green-500': isTwitterVerified, 'bg-gray-500': !isTwitterVerified }">
                        <span class="text-white text-sm">{{ isTwitterVerified ? '✓' : '2' }}</span>
                      </div>
                      <span class="font-semibold" :class="{ 'text-green-300': isTwitterVerified, 'text-gray-300': !isTwitterVerified }">
                        {{ isTwitterVerified ? `✅ Verified: @${twitterUsername}` : '🐦 Verify Twitter' }}
                      </span>
                    </div>
                    <button
                      v-if="!isTwitterVerified"
                      class="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      :disabled="!isLoggedIn || isVerifying"
                      @click="verifyTwitter"
                    >
                      {{ isVerifying ? '⏳ Verifying...' : 'Verify' }}
                    </button>
                  </div>
                </div>

                <!-- NFT Claim -->
                <div class="p-4 rounded-2xl border-2 transition-all duration-300" :class="{ 'bg-green-500/20 border-green-400': isNFTClaimed, 'bg-gray-500/20 border-gray-400': !isNFTClaimed }">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{ 'bg-green-500': isNFTClaimed, 'bg-gray-500': !isNFTClaimed }">
                        <span class="text-white text-sm">{{ isNFTClaimed ? '✓' : '3' }}</span>
                      </div>
                      <span class="font-semibold" :class="{ 'text-green-300': isNFTClaimed, 'text-gray-300': !isNFTClaimed }">
                        {{ isNFTClaimed ? '✅ NFT Claimed' : '🎁 Claim NFT' }}
                      </span>
                    </div>
                    <button
                      v-if="isLoggedIn && isTwitterVerified && !isNFTClaimed"
                      class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      :disabled="isClaiming"
                      @click="claimNFT"
                    >
                      {{ isClaiming ? '⏳ Claiming...' : '🎁 Claim' }}
                    </button>
                  </div>
                </div>

                <!-- Play Again Button -->
                <button
                  v-if="isLoggedIn && isTwitterVerified && isNFTClaimed"
                  class="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  @click="retryGame"
                >
                  🎮 Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Component -->
    <Toast :message="toastMessage" :type="toastType" :visible="toastVisible" @close="toastVisible = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ethers } from 'ethers';
import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk';
import { switchToMonadTestnet } from './config';
import { claimLabubuNFT } from './claim';
import { waitForWallet } from '../utils/walletDetection';
import Toast from './Toast.vue';

// Dynamic image loading
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

// State definitions
const boxes = ref(
    Array(6)
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
const toastType = ref('info');
const toastVisible = ref(false);
const selectedNftId = ref(null);

// Show Toast
const showToast = (msg, type = 'info') => {
  toastMessage.value = msg;
  toastType.value = type;
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
};

// Primus ZK-TLS configuration
const appId = "0x88249fdc1a77090ea963b2bef93a13b43a96c21e";
const appSecret = "0x120ef8be875f5be7e0a1be618df1ec96e2eb89eaeb39f3cd3a4b7f4c931f5351";
const primusZKTLS = new PrimusZKTLS();

// Initialize Primus ZK-TLS
const initPrimus = async () => {
  try {
    if (!appId || !appSecret) {
      throw new Error("appId or appSecret is not set.");
    }
    const initAttestationResult = await primusZKTLS.init(appId, appSecret);
    console.log('Primus initialized successfully:', initAttestationResult);
  } catch (error) {
    console.error('Primus initialization failed:', error);
    showToast('ZK-TLS initialization failed, please retry', 'error');
  }
};
initPrimus();

// Select mystery box
const selectBox = (index) => {
  if (!boxes.value[index].isRevealed && !isCycling.value && !revealedPrize.value) {
    console.log('Selected mystery box:', index);
    selectedIndex.value = index;
  }
};

// Start opening animation
const startCycle = () => {
  if (selectedIndex.value === null) return;
  isCycling.value = true;
  message.value = '';

  setTimeout(() => {
    revealBox();
    isCycling.value = false;
  }, 2500);
};

// Reveal mystery box result
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
  selectedNftId.value = randomPrize.nftId;
  message.value = `Congratulations! You got ${randomPrize.name}!`;
  selectedIndex.value = null;
};

// Cancel selection
const cancelSelection = () => {
  selectedIndex.value = null;
  message.value = '';
};

// Retry game
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
  selectedNftId.value = null;
  boxes.value = Array(6)
      .fill()
      .map(() => ({
        isRevealed: false,
        image: '',
        prize: '',
      }));
};

// Connect MetaMask or OKX wallet and switch to Monad testnet
const loginWallet = async () => {
  try {
    if (!window.ethereum) {
      showToast('Please install MetaMask or OKX wallet!', 'error');
      console.error('MetaMask or OKX not detected');
      return;
    }

    const walletDetection = await waitForWallet(5000);
    if (!walletDetection.isAvailable || !['MetaMask', 'OKX'].includes(walletDetection.walletType)) {
      showToast('Please use MetaMask or OKX wallet!', 'error');
      console.error('Unsupported wallet:', walletDetection.walletType);
      return;
    }

    const switched = await switchToMonadTestnet();
    if (!switched) {
      showToast('Unable to switch to Monad testnet, please switch network manually', 'error');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    if (accounts.length > 0) {
      userAddress.value = accounts[0];
      isLoggedIn.value = true;
      showToast(`Wallet connected: ${userAddress.value.slice(0, 6)}...${userAddress.value.slice(-4)}`, 'success');
    } else {
      showToast('Unable to connect wallet, please retry!', 'error');
    }
  } catch (error) {
    showToast('Wallet connection failed, please check MetaMask or OKX settings!', 'error');
    console.error('Wallet connection error:', error);
  }
};

// Twitter verification
const verifyTwitter = async () => {
  if (!isLoggedIn.value || !userAddress.value) {
    showToast('Please connect wallet first!', 'error');
    return;
  }

  isVerifying.value = true;
  showToast('Performing Twitter verification...', 'info');

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
      showToast(`✅ Twitter verification successful! Username: @${twitterUsername.value}`, 'success');
    } else {
      showToast('❌ Twitter verification failed, please retry', 'error');
    }
  } catch (error) {
    showToast(`Verification failed: ${error.message || 'Please retry'}`, 'error');
    console.error('Twitter verification error:', error);
  } finally {
    isVerifying.value = false;
  }
};

// Claim Labubu NFT
const claimNFT = async () => {
  if (!isLoggedIn.value || !isTwitterVerified.value || !userAddress.value || !attestationData.value || selectedNftId.value === null) {
    showToast('Please complete wallet connection, Twitter verification and select a mystery box!', 'error');
    return;
  }

  isClaiming.value = true;
  showToast('Detecting wallet environment...', 'info');

  try {
    const walletDetection = await waitForWallet(5000);
    if (!walletDetection.isAvailable || !['MetaMask', 'OKX'].includes(walletDetection.walletType)) {
      showToast('Please use MetaMask or OKX wallet!', 'error');
      console.error('Unsupported wallet:', walletDetection.walletType);
      return;
    }

    const switched = await switchToMonadTestnet();
    if (!switched) {
      showToast('Unable to switch to Monad testnet, please switch network manually', 'error');
      return;
    }

    showToast('Claiming Labubu NFT...', 'info');

    const claimResult = await claimLabubuNFT(
        attestationData.value,
        selectedNftId.value,
        userAddress.value,
        (txHash) => {
          isNFTClaimed.value = true;
          showToast(`🎉 Labubu NFT claimed successfully! Transaction hash: ${txHash}`, 'success');
        },
        (error) => {
          showToast(error.message, 'error');
          console.error('NFT claim failed:', error);
        }
    );

    if (!claimResult.success) {
      showToast(claimResult.error, 'error');
    }
  } catch (error) {
    showToast(`NFT claim failed: ${error.message || 'Please retry'}`, 'error');
    console.error('NFT claim error:', error);
  } finally {
    isClaiming.value = false;
  }
};

// Handle image loading error
const handleImageError = (event) => {
  console.error('Image loading error:', event.target.src);
  event.target.src = 'https://via.placeholder.com/500?text=Error';
};
</script>

<style scoped>
/* Custom animations and effects */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}
</style>