import React, { useContext, useEffect, useState } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Libraries
import PropTypes from 'prop-types';

function CollectionInfo(props) {
  const { collection } = props;

  const {
    loadName, loadSymbol, totalSupply, contractIsEnumerable,
  } = useContext(Web3Context);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');

  useEffect(() => {
    // totalSupply is only available for contracts that are enumerable
    if (!contractIsEnumerable) return;

    const getTotalSupply = async () => {
      try {
        const _supply = await totalSupply(collection);
        console.log(_supply);
        setSupply(_supply);
      } catch (e) {
        console.log(e);
      }
    };

    getTotalSupply();
  }, [collection]);

  useEffect(() => {
    const _loadName = async () => {
      try {
        const _name = await loadName(collection);
        setName(_name);
      } catch (e) {
        console.log(e);
      }
    };

    setName('');
    _loadName();
  }, [collection]);

  useEffect(() => {
    const _loadSymbol = async () => {
      try {
        const _symbol = await loadSymbol(collection);
        setSymbol(_symbol);
      } catch (e) {
        console.log(e);
      }
    };

    setSymbol('');
    _loadSymbol();
  }, [collection]);

  return (
    <div
      className="is-flex my-5"
    >
      <div className="has-background-black br6 is-inline-block has-margin-auto has-text-centered p-3">
        <p
          className="has-text-weight-semibold has-text-white"
        >
          Collection:
        </p>
        <p
          className="has-text-weight-bold has-text-white"
        >
          {
            name ? `${name} ${symbol ? `(${symbol})` : ''}` : 'Loading...'
          }
        </p>
        {
          supply
          && (
          <p
            className="has-text-weight-bold has-text-white"
          >
            { `Tokens minted: ${supply}` }
          </p>
          )
        }
      </div>
    </div>
  );
}

CollectionInfo.propTypes = {
  collection: PropTypes.string,
};

CollectionInfo.defaultProps = {
  collection: '',
};

export default CollectionInfo;
