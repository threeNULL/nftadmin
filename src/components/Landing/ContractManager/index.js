import React, { useContext } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Components
import LoginButton from 'components/utils/LoginButton';
import Inventory from './Inventory';
import ChainDisplay from './ChainDisplay';
import WalletDisplay from './WalletDisplay';

function ContractManager() {
  const {
    isAuthenticated,
  } = useContext(Web3Context);

  if (!isAuthenticated) {
    return (
      <div
        className="has-text-centered my-6"
      >
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="pt-6 pb-5">
      <div className="columns is-centered">
        <div className="column is-6-desktop has-max-width-800">
          <div className="">
            <div
              className="box p-5 has-text-centered"
            >
              <div
                className=" has-text-left"
              >
                <p
                  className="is-size-3-desktop has-text-weight-bold mb-2"
                >
                  Your account
                </p>
                <WalletDisplay />
                <ChainDisplay />
              </div>
            </div>

            <div
              className="box p-5 mt-6"
            >
              <Inventory />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default ContractManager;
