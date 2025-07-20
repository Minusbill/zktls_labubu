import { ethers } from 'ethers';
import { getConfig } from '../components/config';
import NFTClaimABI from '../contracts/NFTClaim.abi.json';

export async function checkClaimEligibility(walletAddress, nftId) {
    try {

        console.log("walletAddress" +walletAddress)
        console.log("nftId" +nftId)

        const appConfig = getConfig();
        const provider = new ethers.providers.JsonRpcProvider(appConfig.NETWORK.rpcUrl);
        const contract = new ethers.Contract(appConfig.CONTRACT_ADDRESS, NFTClaimABI, provider);

        console.info("appConfig.CONTRACT_ADDRESS"+ appConfig.CONTRACT_ADDRESS)

        const totalSupply = await contract.TOTAL_SUPPLY();
        const totalClaimed = await contract.totalClaimed();
        const hasClaimed = await contract.hasUserClaimed(walletAddress);
        const maxNftId = await contract.MAX_NFT_ID();

        const reasons = [];
        let canClaim = true;

        if (totalClaimed >= totalSupply) {
            reasons.push('All NFTs have been claimed');
            canClaim = false;
        }
        if (hasClaimed) {
            reasons.push('Already claimed');
            canClaim = false;
        }
        if (nftId <= 0 || nftId > maxNftId) {
            reasons.push('Invalid NFT ID');
            canClaim = false;
        }

        return {
            canClaim,
            reasons,
            contractStatus: {
                totalSupply: totalSupply.toNumber(),
                totalClaimed: totalClaimed.toNumber(),
                remainingSupply: totalSupply.toNumber() - totalClaimed.toNumber(),
                maxNftId: maxNftId.toNumber()
            },
        };
    } catch (error) {
        console.error('检查领取资格失败:', error);
        return {
            canClaim: false,
            reasons: ['Failed to check eligibility'],
            contractStatus: {
                totalSupply: 0,
                totalClaimed: 0,
                remainingSupply: 0,
                maxNftId: 0
            },
        };
    }
}