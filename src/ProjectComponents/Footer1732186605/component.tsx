
import React from 'react';
import * as ethers from 'ethers';

const LidoLocatorInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [results, setResults] = React.useState<Record<string, string>>({});

  const contractAddress = '0x3abc4764f0237923d52056cfba7e9aebf87113d3';
  const chainId = 1; // Ethereum mainnet

  const contractABI = [
    { "name": "accountingOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "burner", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "coreComponents", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }] },
    { "name": "depositSecurityModule", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "elRewardsVault", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "legacyOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "lido", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "oracleDaemonConfig", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "oracleReportComponentsForLido", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "address", "internalType": "address" }] },
    { "name": "oracleReportSanityChecker", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "postTokenRebaseReceiver", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "stakingRouter", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "treasury", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "validatorsExitBusOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "withdrawalQueue", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] },
    { "name": "withdrawalVault", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }] }
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(chainId) }],
            });
          } catch (switchError) {
            console.error('Failed to switch to the correct network:', switchError);
            return;
          }
        }
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      } catch (error) {
        console.error('Failed to connect to the wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const callContractMethod = async (methodName: string) => {
    if (!contract) {
      await connectWallet();
    }
    if (contract) {
      try {
        const result = await contract[methodName]();
        setResults(prevResults => ({ ...prevResults, [methodName]: Array.isArray(result) ? result.join(', ') : result }));
      } catch (error) {
        console.error(`Error calling ${methodName}:`, error);
        setResults(prevResults => ({ ...prevResults, [methodName]: 'Error: ' + (error as Error).message }));
      }
    }
  };

  const renderMethodButton = (methodName: string) => (
    <div key={methodName} className="mb-4">
      <button
        onClick={() => callContractMethod(methodName)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Call {methodName}
      </button>
      <div className="mt-2">
        Result: {results[methodName] || 'Not called yet'}
      </div>
    </div>
  );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Lido Locator Interaction</h1>
      <button
        onClick={connectWallet}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Connect Wallet
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractABI.map(method => renderMethodButton(method.name))}
      </div>
    </div>
  );
};

export { LidoLocatorInteraction as component };
