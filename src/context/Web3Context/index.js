import React, { useState, useEffect, useMemo } from 'react';

// Libraries
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import ERC721Factory from './ERC721Factory';

// Hooks
import useAPI from 'hooks/useAPI';
import axios from 'axios';
import { sanitizeUrl } from '@braintree/sanitize-url';

const { AddressZero } = ethers.constants;

const GATEWAYS = [
  'https://ipfs.moralis.io:2053/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://infura-ipfs.io/ipfs/',
];

// const contractAddress = '0x4448527AE14f942Cd8A006e2a52C7852346Bb37c';

const Web3Context = React.createContext({});

export function Web3Provider(props) {
  const { children } = props;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const [contract, setContract] = useState();
  const [contractAddress, setContractAddress] = useState('');
  const [contractHasMetadata, setContractHasMetadata] = useState(false);
  const [contractIsEnumerable, setContractIsEnumerable] = useState(false);

  const [chain, setChain] = useState();
  const [chainId, setChainId] = useState();

  const [acc, setAcc] = useState();

  const [nfts, setNfts] = useState([]);
  const [activeNft, setActiveNft] = useState();

  const { get } = useAPI();

  const getChainNameById = () => {
    if (chainId === 1) return 'eth';
    if (chainId === 3) return 'ropsen';
    if (chainId === 4) return 'rinkeby';
    if (chainId === 137) return 'polygon';

    return undefined;
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const requestLogin = async () => {
      try {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider);

        const _signer = _provider.getSigner();
        setSigner(_signer);

        const { chainId: _chainId } = await _provider.getNetwork();

        setChainId(_chainId);

        window.ethereum.on('accountsChanged', (accounts) => {
          window.location.reload();
        });

        window.ethereum.on('chainChanged', (newChain) => {
          // Handle the new chain.
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have good reason not to.
          window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
          window.location.reload();
        });
      } catch (e) {
        console.log(e);
      }
    };

    requestLogin();
  }, []);

  useEffect(() => {
    setChain(getChainNameById(chainId));
  }, [chainId]);

  const login = async () => {
    try {
      console.log('Login with signer', provider);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== acc) {
        // setting acc!
        setAcc(accounts[0]);
      }

      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);

      if (e.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        throw new Error('The connection request has been rejected. To login, please connect with MetaMask!');
      }

      throw new Error('Something did not work. Please try again later!');
    }
  };

  /**
   * Loads all (ERC-721) NFTs a wallet currently holds
   * @returns {Array} All the nfts for a wallet
   */
  const getNftsForWallet = async (address, searchQuery) => {
    if (!address) throw new Error('Missing address');

    const params = {
      chain,
    };

    if (searchQuery) params.q = searchQuery;

    const data = await get(`/nfts/${address}`, { params });

    return data;
  };

  /**
   * Gets the balance of the specified address.
   */
  const balanceOf = async (address) => {
    const result = await contract.balanceOf(address);

    return result;
  };

  /**
   * Gets the owner of the specified token ID.
   */
  const ownerOf = async (tokenId) => {
    const result = await contract.ownerOf(tokenId);

    return result;
  };

  /**
   * Revokes any other address to transfer the given token ID. The zero address indicates there is no approved address. There can only be one approved address per token at a given time. Can only be called by the token owner or an approved operator.
   */
  const revoke = async (tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    // Approving address zero means revoking previous approvals
    const result = await caller.approve(AddressZero, tokenId);

    return result.hash;
  };

  /**
   * Approves another address to transfer the given token ID. The zero address indicates there is no approved address. There can only be one approved address per token at a given time. Can only be called by the token owner or an approved operator.
   */
  const approve = async (to, tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller.approve(to, tokenId);

    return result.hash;
  };

  /**
   * Gets the approved address for a token ID, or zero if no address set Reverts if the token ID does not exist.
   */
  const getApproved = async (tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller.getApproved(tokenId);

    return result;
  };

  /**
   * Sets or unsets the approval of a given operator An operator is allowed to transfer all tokens of the sender on their behalf.
   */
  const setApprovalForAll = async (to, approved, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller.setApprovalForAll(to, approved);

    return result.hash;
  };

  /**
   * Tells whether an operator is approved by a given owner
   */
  const isApprovedForAll = async (address, operator, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller.isApprovedForAll(address, operator);

    return result;
  };

  /**
   * Safely transfers the ownership of a given token ID to another address.
   * If the target address is a contract, it must implement IERC721Receiver.onERC721Received, which is called upon a safe transfer, and return the magic value bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
   * otherwise, the transfer is reverted.
   * Requires the msg.sender to be the owner, approved, or operator
   */
  const safeTransferFrom = async (address, to, tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = await ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller['safeTransferFrom(address,address,uint256)'](address, to, tokenId);

    return result.hash;
  };

  const waitForTransaction = async (tx) => {
    await provider.waitForTransaction(tx);
  };

  /**
   * Returns whether the specified token exists.
   */
  const exists = async (tokenId) => {
    const result = await contract.exists(tokenId);

    return result;
  };

  /**
   * Returns whether the given spender can transfer a given token ID.
   */
  const isApprovedOrOwner = async (spender, tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const result = await caller.isApprovedOrOwner(spender, tokenId);

    return result;
  };

  const loadName = async (_contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const name = await caller.name();
    return name;
  };

  const loadSymbol = async (_contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const symbol = await caller.symbol();

    return symbol;
  };

  const tokenUri = async (tokenId, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    // const uri = await caller['tokenURI(uint256)'](tokenId);
    const uri = await caller.tokenURI(tokenId);

    return uri;
  };

  const totalSupply = async (_contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const supply = await caller.totalSupply();

    return supply;
  };

  const getENSName = async (address) => {
    const name = await provider.lookupAddress(address);

    return name;
  };

  const tokenByIndex = async (index, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const tokenId = await caller.tokenByIndex(index);

    return tokenId;
  };

  const tokenOfOwnerByIndex = async (owner, index, _contractAddress = '') => {
    let caller = contract;

    if (_contractAddress) {
      caller = ERC721Factory.connect(signer, _contractAddress);
    }

    const tokenId = await caller.tokenOfOwnerByIndex(owner, index);

    return tokenId;
  };

  const loadMetadata = async (nft) => {
    const { tokenAddress, tokenId } = nft;

    const caller = ERC721Factory.connect(signer, tokenAddress);
    let tokenURI = await caller.tokenURI(tokenId);

    tokenURI = sanitizeUrl(tokenURI);

    if (tokenURI.startsWith('ipfs://')) {
      // get a random gateway so we dont get timed out by one of them when loading a lot of data
      const randomGateway = GATEWAYS[Math.floor(Math.random() * GATEWAYS.length)];
      tokenURI = tokenURI.replace('ipfs://', randomGateway);
    }

    const { data } = await axios.get(tokenURI);

    const metadata = data;

    metadata.image = sanitizeUrl(metadata.image);

    // prepare metadata image
    if (metadata.image.startsWith('ipfs://')) {
      // get a random gateway so we dont get timed out by one of them when loading a lot of data
      const randomGateway = GATEWAYS[Math.floor(Math.random() * GATEWAYS.length)];
      metadata.image = metadata.image.replace('ipfs://', randomGateway);
    }

    const index = nfts.findIndex((_nft) => _nft.tokenId === tokenId && _nft.tokenAddress === tokenAddress);

    if (index === -1) throw new Error('Cannot update NFT - Not found');

    // update state with function, as state might be stale otherwise
    setNfts((_nfts) => {
      // add metadata to the nft
      _nfts[index] = {
        ...nft,
        metadata,
      };

      // return a "new" array to trigger a rerender
      return [..._nfts];
    });
  };

  const loadContract = async (_contractAddress) => {
    try {
      if (_contractAddress.toLowerCase() === acc.toLowerCase()) {
        throw new Error('Contract is signer');
      }

      const contractCode = await provider.getCode(_contractAddress);

      // if we dont get the bytecode but just a 0x, its not a contract
      // see https://ethereum.stackexchange.com/questions/28521/how-to-detect-if-an-address-is-a-contract/28527
      if (contractCode === '0x') {
        throw new Error('Invalid contract');
      }

      const _contract = ERC721Factory.connect(signer, _contractAddress);

      /*
        * Check basic ERC 721 functionality (no tokenURI or Enumerable stuff)
        * see https://ethereum.stackexchange.com/questions/44880/erc-165-query-on-erc-721-implementation
        * 0x80ac58cd ===
        *   bytes4(keccak256('balanceOf(address)')) ^
        *   bytes4(keccak256('ownerOf(uint256)')) ^
        *   bytes4(keccak256('approve(address,uint256)')) ^
        *   bytes4(keccak256('getApproved(uint256)')) ^
        *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
        *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
        *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
        *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
        */

      try {
        const isERCContract = await _contract.supportsInterface(0x80ac58cd);
        if (!isERCContract) throw new Error('Invalid contract');

        const hasERCMetadata = await _contract.supportsInterface(0x5b5e139f);
        setContractHasMetadata(hasERCMetadata);

        const isERCEnumerable = await _contract.supportsInterface(0x780e9d63);
        setContractIsEnumerable(isERCEnumerable);
      } catch (e) {
        console.log(e);
        throw new Error('Invalid contract');
      }

      setContract(_contract);
      setContractAddress(_contractAddress);
    } catch (e) {
      setContractAddress('');
      throw e;
    }
  };

  const sendTransaction = async (to, amount) => {
    const result = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(`${amount}`),
    });

    return result.hash;
  };

  const ipfsToUrl = (ipfsUrl) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      // get a random gateway so we dont get timed out by one of them when loading a lot of data
      const randomGateway = GATEWAYS[Math.floor(Math.random() * GATEWAYS.length)];
      ipfsUrl = ipfsUrl.replace('ipfs://', randomGateway);
    }

    return ipfsUrl;
  };

  const values = useMemo(() => ({
    account: acc || '',
    isAuthenticated,

    chainId,
    chain,

    contractAddress,
    contractHasMetadata,
    contractIsEnumerable,

    nfts,
    activeNft,

    setNfts,
    setActiveNft,
    loadMetadata,

    getNftsForWallet,

    login,

    loadContract,
    waitForTransaction,

    sendTransaction,
    getENSName,

    // ERC 721 functions
    loadName,
    loadSymbol,
    balanceOf,
    tokenUri,
    ownerOf,
    approve,
    revoke,
    getApproved,
    setApprovalForAll,
    isApprovedForAll,
    safeTransferFrom,
    exists,
    isApprovedOrOwner,

    // ERC-721 Enumerable functions
    totalSupply,
    tokenByIndex,
    tokenOfOwnerByIndex,

    // Helpers
    ipfsToUrl,

  }), [acc, isAuthenticated, provider, signer, chainId, chain, contractAddress, nfts, activeNft]);

  return (
    <Web3Context.Provider
      value={values}
    >
      {children}
    </Web3Context.Provider>
  );
}

Web3Provider.propTypes = {
  children: PropTypes.node,
};

Web3Provider.defaultProps = {
  children: {},
};

export default Web3Context;
