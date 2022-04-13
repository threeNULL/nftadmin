import React, { useContext, useEffect, useState } from 'react';

// Libraries
import PropTypes from 'prop-types';
import { sanitizeUrl } from '@braintree/sanitize-url';

// Assets
import loader from 'assets/images/icons/loader.gif';

// Context
import Web3Context from 'context/Web3Context';

function NFTDisplay(props) {
  const { nft, onClick, waitTime } = props;

  const { tokenAddress, metadata } = nft;

  const { name, description, image } = metadata;

  const { loadMetadata } = useContext(Web3Context);

  const [notFound, setNotFound] = useState(false);
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    if (name || description || image) return;

    const _loadMetadata = async () => {
      await loadMetadata(nft);
    };

    _loadMetadata();
  }, [nft]);

  useEffect(() => {
    if (!image) return null;

    let img;

    const timeout = setTimeout(() => {
      img = new Image();

      const src = sanitizeUrl(image);
      img.src = src;

      img.onload = () => {
        setImageSrc(src);
      };

      img.onerror = () => {
        setNotFound(true);
      };

      // TODO: if we receive a 404, show a NOT FOUND image
    }, waitTime || 0);

    return () => {
      if (img) {
        img.onload = () => {};
        img.onerror = () => {};
      }
      setImageSrc();
      clearTimeout(timeout);
    };
  }, [image]);

  if (!metadata) {
    return (
      <button
        type="button"
        onClick={() => onClick(nft)}
        className="has-background-grey-lighter has-width-70 has-height-70 has-cursor-pointer p-2 is-flex br8"
      >
        <div
          className="button is-loading has-border-black-light br6 has-fullwidth has-fullheight p-0 m-0"
        />
      </button>
    );
  }

  const showImage = () => {
    if (!image || notFound) {
      return (
        <div
          className="has-border-black-light br6 has-fullwidth has-fullheight p-0 m-0"
        >
          <div
            className="has-border-black-light br6 has-fullwidth has-fullheight p-0 m-0"
          />
        </div>
      );
    }

    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt=""
          className="has-border-black-light br6 has-fullwidth has-fullheight p-0 m-0"
        />

      );
    }

    return (
      <div
        className="has-border-black-light br6 has-fullwidth has-fullheight p-0 m-0"
      >
        <img src={loader} alt="" className="has-fullwidth has-fullheight" />
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={() => onClick(nft)}
      className="has-background-grey-lighter has-width-70 has-height-70 has-cursor-pointer p-2 is-flex br8 has-border"
    >
      { showImage() }
    </button>
  );
}

NFTDisplay.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    metadata: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func,
  waitTime: PropTypes.number,
};

NFTDisplay.defaultProps = {
  onClick: () => {},
  waitTime: 0,
};

export default NFTDisplay;
