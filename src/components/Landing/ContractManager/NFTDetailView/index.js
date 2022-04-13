import React, {
  useEffect, useState, useMemo, useContext,
} from 'react';

// Libraries
import { sanitizeUrl } from '@braintree/sanitize-url';
import PropTypes from 'prop-types';

// Contex
import Web3Context from 'context/Web3Context';

// Assets
import loader from 'assets/images/icons/loader.gif';
import openSeaIcon from 'assets/images/icons/opensea.svg';

// Components
import ApprovedView from './ApprovedView';
import TransferButton from './TransferButton';
import RevokeButton from './RevokeButton';
import ApproveButton from './ApproveButton';
import ApproveAllButton from './ApproveAllButton';
import ContractLink from '../ContractLink';
import TokenIdDisplay from '../TokenIdDisplay';

function NFTDetailView(props) {
  const { nft } = props;

  const { chain } = useContext(Web3Context);

  if (!nft) return null;

  const {
    tokenAddress, tokenId, metadata, tokenName, tokenSymbol,
  } = nft;

  const openSeaLink = useMemo(() => {
    if (!tokenName) return null;

    if (chain === 'eth') {
      return `https://opensea.io/collection/${tokenName.toLowerCase()}`;
    }

    if (chain === 'rinkeby') {
      return `https://testnets.opensea.io/collection/${tokenName.toLowerCase()}`;
    }

    return null;
  }, [tokenName]);

  const { name, description, image } = metadata;

  const [notFound, setNotFound] = useState(false);
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    if (!image) return null;
    setImageSrc('');

    const img = new Image();

    const src = sanitizeUrl(image);
    img.src = src;

    img.onload = () => {
      const sanitizedUrl = sanitizeUrl(src);

      setImageSrc(sanitizedUrl);
    };

    img.onerror = () => {
      console.log('Setting not found to true');
      setNotFound(true);
    };

    return () => {
      if (img) {
        img.onload = () => { };
        img.onerror = () => { };
      }

      setNotFound(false);
      setImageSrc();
    };
  }, [image]);

  if (!metadata) {
    return (
      <p>{`Loading metadata for contract ${tokenAddress}...`}</p>
    );
  }

  const showImage = () => {
    if (!image || notFound === true) {
      return (
        <div
          className="has-border-black-light br6 has-width-128 has-height-128 p-0 m-0 is-flex has-content-centered"
        >
          <p className="has-text-grey is-size-7">
            Image not found
          </p>
        </div>
      );
    }

    if (imageSrc) {
      return (
        <div
          className="has-border-black-light br6 has-width-128 has-height-128 p-0 m-0"
        >
          <img src={imageSrc} alt="" className="has-fullheight has-fullwidth br6" />
        </div>
      );
    }

    return (
      <div
        className="has-border-black-light br6 has-width-128 has-height-128 p-0 m-0"
      >
        <img src={loader} alt="" className="has-fullheight has-fullwidth br6" />
      </div>
    );
  };

  return (
    <div className="my-3">
      <div className="columns columns-with-margin is-multiline">
        <div className="column is-narrow">
          {showImage()}
        </div>
        <div className="column">
          {
            name
              ? (
                <p className="mt-3 has-text-weight-bold has-width-300 shorten-text">
                  {name}
                </p>
              )
              : (
                <p className="mt-3 has-text-grey">
                  This NFT does not have a name.
                </p>
              )
          }
          {
            description
              ? (
                <p className="mt-1 has-max-height-150 has-overflow-y-auto">
                  {description}
                </p>
              )
              : (
                <p className="mt-1 has-text-grey">
                  This NFT does not have a description.
                </p>
              )
          }
        </div>
      </div>
      <div>

        <div className="is-flex has-space-between">
          <p className="has-text-weight-bold">
            Collection:
          </p>
          {
            tokenName
              ? (
                <p className="shorten-text">
                  {tokenName + (tokenSymbol ? ` (${tokenSymbol})` : '')}
                </p>
              )
              : (
                <p className="has-text-grey">
                  No collection name found
                </p>
              )
          }
        </div>

        <ContractLink address={tokenAddress} />

        <TokenIdDisplay tokenId={tokenId} />

        {
          openSeaLink
          && (
          <div
            className="mt-2"
          >
            <a
              className="is-block has-width-30 has-height-30 growBig"
              href={openSeaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt=""
                className="has-fullwidth has-fullheight"
                src={openSeaIcon}
              />
            </a>
          </div>
          )
        }

        <div className="mt-4">
          <ApprovedView nft={nft} />
        </div>

        <p
          className="is-size-7 has-border-bottom"
        >
          The following actions affect the selected NFT above.
        </p>

        <div className="has-max-width-300 has-margin-auto">
          <div className="mt-4">
            <TransferButton nft={nft} />
          </div>

          <div className="mt-4">
            <ApproveButton nft={nft} />
          </div>

          <div className="mt-4">
            <ApproveAllButton nft={nft} />
          </div>

          <div className="mt-4">
            <RevokeButton nft={nft} />
          </div>
        </div>

      </div>
    </div>
  );
}

NFTDetailView.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    tokenId: PropTypes.string,
    tokenName: PropTypes.string,
    tokenSymbol: PropTypes.string,
    metadata: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
    }),
  }),
};

NFTDetailView.defaultProps = {
  nft: {
    tokenAddress: '',
    tokenId: '',
    tokenName: '',
    tokenSymbol: '',
    metadata: {
      name: '',
      description: '',
      image: '',
    },
  },
};

export default NFTDetailView;
