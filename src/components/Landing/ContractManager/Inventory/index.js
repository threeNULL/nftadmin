import React, { useEffect, useState, useContext } from 'react';

// Context
import Web3Context from 'context/Web3Context';
import NFTDisplay from '../NFTDisplay';
import NFTDetailView from '../NFTDetailView';

function Inventory() {
  const [status, setStatus] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);

  const {
    account, nfts, activeNft, setNfts, setActiveNft, getNftsForWallet,
  } = useContext(Web3Context);

  const selectNft = (nft) => {
    setActiveNft(nft);
  };

  const loadMoreNfts = async () => {
    try {
      setStatus('');
      setDisabled(true);

      const newNfts = await getNftsForWallet(account, nfts.length);

      if (newNfts.length === 20) {
        setShowLoadMoreButton(true);
      } else {
        setShowLoadMoreButton(false);
      }

      setNfts([...nfts, ...newNfts]);
      setDisabled(false);
    } catch (e) {
      setStatus('Could not load your nfts! Please try again later :/');
      setDisabled(false);
    }
  };

  const loadNfts = async () => {
    try {
      setStatus('');
      setDisabled(true);

      const _nfts = await getNftsForWallet(account, 0);

      if (_nfts.length === 20) {
        setShowLoadMoreButton(true);
      } else {
        setShowLoadMoreButton(false);
      }

      setNfts(_nfts);
      setDisabled(false);
      setHasLoaded(true);
    } catch (e) {
      setStatus('Could not load your nfts! Please try again later :/');
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (nfts.length !== 0 || !account) return;

    loadNfts();
  }, [account]);

  const showNfts = () => nfts.map((nft, index) => (
    <div
      className="column is-narrow has-text-centered is-flex has-content-centered p-1"
      key={index}
    >
      <NFTDisplay nft={nft} onClick={selectNft} />
    </div>
  ));

  if (!hasLoaded) {
    return (
      <div className="has-fullheight is-flex flex-direction-column">
        <p
          className="has-text-weight-bold is-size-3"
        >
          Your inventory
        </p>
        <p>Loading your nfts...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="has-fullheight is-flex flex-direction-column">
        <p
          className="has-text-weight-bold is-size-3"
        >
          Your inventory
        </p>
        <p>Seems like you dont have any NFTs!</p>
      </div>
    );
  }

  return (
    <div className="has-fullheight is-flex flex-direction-column">
      <p
        className="has-text-weight-bold is-size-3"
      >
        Your inventory
      </p>
      {
        nfts.length > 0
        && (
          <p>
            Click on the NFT you want to manage!
          </p>
        )
      }
      <p>
        {status}
      </p>

      <div
        className="mt-4"
      >
        <div className="">
          <div className="columns is-multiline is-centered is-mobile">
            {showNfts()}
          </div>

          {
            activeNft
            && (
              <div
                className="mb-5 px-5 has-margin-auto"
              >
                <NFTDetailView nft={activeNft} />
              </div>
            )
          }

        </div>
      </div>

      {
        showLoadMoreButton
        && (
          <div className="has-text-centered">
            <button
              type="button"
              className={`button is-info my-3 has-text-weight-bold ${disabled ? 'is-loading' : ''}`}
              onClick={loadMoreNfts}
              disabled={disabled}
            >
              Load more
            </button>
          </div>
        )
      }

    </div>
  );
}

export default Inventory;
