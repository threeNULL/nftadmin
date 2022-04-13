import React, {
  useContext, useState, useEffect, useMemo,
} from 'react';

// Context
import Web3Context from 'context/Web3Context';

function WalletDisplay() {
  const {
    account, getENSName, chain,
  } = useContext(Web3Context);

  const [ensName, setEnsName] = useState('');

  useEffect(() => {
    if (!account) return;

    const loadEnsName = async () => {
      try {
        const name = await getENSName(account);
        setEnsName(name);
      } catch (e) {
        console.log(e);
      }
    };

    loadEnsName();
  }, [account]);

  const walletLink = useMemo(() => {
    if (chain === 'eth') return `https://etherscan.io/address/${account}`;
    if (chain === 'rinkeby') return `https://rinkeby.etherscan.io/address/${account}`;
    if (chain === 'polygon') return `https://polygonscan.com/address/${account}`;

    return '';
  }, [chain]);

  return (
    <div>
      <p
        className="is-inline-block mr-1"
      >
        Your wallet:
      </p>
      <a
        href={walletLink}
        className=""
        target="_blank"
        rel="noopener noreferrer"
      >
        {
            ensName ? (`${ensName} (${account})`) : account
        }
      </a>
    </div>
  );
}

export default WalletDisplay;
