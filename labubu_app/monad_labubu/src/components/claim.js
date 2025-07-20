import { ethers } from 'ethers';
import NFTClaimABI from '../contracts/NFTClaim.abi.json';
import { getConfig } from './config';
import { checkClaimEligibility } from '../utils/contractQuery';

function parseContractError(error) {
    if (error.reason) return error.reason;
    if (error.message) {
        const revertMatch = error.message.match(/revert (.+)/);
        if (revertMatch) return revertMatch[1];
        if (error.message.includes('execution reverted')) {
            const revertReasonMatch = error.message.match(/execution reverted: (.+)/);
            if (revertReasonMatch) return revertReasonMatch[1];
        }
    }
    if (error.error && error.error.message) return parseContractError(error.error);
    return error.message || 'Unknown error';
}

export async function claimLabubuNFT(attestation, nftId, walletAddress, onSuccess, onError) {
    try {
        const appConfig = getConfig();
        const CONTRACT_ADDRESS = appConfig.CONTRACT_ADDRESS;

        console.log('开始领取 Labubu NFT...', { contractAddress: CONTRACT_ADDRESS, attestation, nftId, walletAddress });

        if (!window.ethereum) {
            throw new Error('请先连接 MetaMask 或 OKX 钱包');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new Error('钱包地址不匹配，请使用正确的钱包账户');
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTClaimABI, signer);

        console.log('检查合约状态和用户资格...');
        const eligibilityCheck = await checkClaimEligibility(walletAddress, nftId);

        if (!eligibilityCheck.canClaim) {
            const errorMsg = eligibilityCheck.reasons.join('; ');
            console.error('领取资格检查失败:', errorMsg);
            throw new Error(errorMsg);
        }

        console.log('领取资格检查通过', {
            totalClaimed: eligibilityCheck.contractStatus.totalClaimed,
            totalSupply: eligibilityCheck.contractStatus.totalSupply,
            remainingSupply: eligibilityCheck.contractStatus.remainingSupply
        });

        let tx;
        const gasLimit = 300000;

        if (attestation && typeof attestation === 'object') {
            console.log('使用验证数据领取 Labubu NFT');
            try {
                const estimatedGas = await contract.estimateGas.claimNFT(attestation, nftId);
                console.log('估算的gas:', estimatedGas.toString());
                tx = await contract.claimNFT(attestation, nftId, {
                    gasLimit: estimatedGas.mul(120).div(100)
                });
            } catch (estimateError) {
                console.warn('Gas估算失败:', estimateError);
                const errorMessage = parseContractError(estimateError);
                if (errorMessage.includes('Screen name already used')) {
                    throw new Error('Screen name already used');
                }
                tx = await contract.claimNFT(attestation, nftId, { gasLimit });
            }
        }

        const receipt = await tx.wait();

        console.log('Labubu NFT 领取成功！', {
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });

        if (onSuccess) onSuccess(receipt.transactionHash);

        return {
            success: true,
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error('Labubu NFT 领取失败:', error);

        const parsedError = parseContractError(error);
        let errorMessage = '领取失败，请重试';

        if (error.code === 4001) errorMessage = '用户取消了交易';
        else if (error.code === -32603) errorMessage = '交易失败，可能是合约执行错误';
        else if (parsedError.includes('insufficient funds')) errorMessage = '余额不足，请确保有足够的Gas费用';
        else if (parsedError.includes('All NFTs have been claimed')) errorMessage = '❌ 所有 Labubu NFT 已被领取完毕';
        else if (parsedError.includes('Invalid NFT ID')) errorMessage = '❌ 无效的 NFT ID，请选择有效的 Labubu NFT';
        else if (parsedError.includes('Already claimed')) errorMessage = '❌ 您已经领取过 Labubu NFT 了，每个地址只能领取一次';
        else if (parsedError.includes('Invalid recipient')) errorMessage = '❌ 验证数据中的接收地址与当前钱包地址不匹配';
        else if (parsedError.includes('Screen name not found')) errorMessage = '❌ 验证数据中未找到用户名信息';
        else if (parsedError.includes('Screen name already used')) errorMessage = '该 Twitter 用户名已被使用';
        else if (parsedError.includes('Invalid attestation') || parsedError.includes('Attestation verification failed')) errorMessage = '❌ ZK-TLS 验证失败，请重新进行验证';
        else if (parsedError.includes('network')) errorMessage = '❌ 网络错误，请检查网络连接或切换网络';
        else if (parsedError.includes('请先连接钱包')) errorMessage = '❌ 请先连接钱包';
        else if (parsedError.includes('钱包地址不匹配')) errorMessage = '❌ 钱包地址不匹配，请使用正确的钱包账户';
        else if (parsedError.includes('gas required exceeds allowance') || parsedError.includes('out of gas')) errorMessage = '❌ Gas 费用不足，请增加 Gas 限制或确保有足够的 MON';
        else if (parsedError.includes('gas price too low')) errorMessage = '❌ Gas 价格过低，请提高 Gas 价格';
        else if (parsedError.includes('transaction underpriced')) errorMessage = '❌ 交易费用过低，请提高 Gas 价格';
        else if (parsedError.includes('nonce too low')) errorMessage = '❌ 交易序号错误，请重试';
        else if (parsedError.includes('transaction failed')) errorMessage = '❌ 交易执行失败，请检查合约状态';
        else if (parsedError !== 'Unknown error') errorMessage = `❌ ${parsedError}`;

        if (onError) onError(new Error(errorMessage));

        return {
            success: false,
            error: errorMessage
        };
    }
}