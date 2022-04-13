import React, { useContext, useState } from 'react';

// Context
import Web3Context from 'context/Web3Context';

function LoginButton() {
  const { login } = useContext(Web3Context);

  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState('');

  const _login = async () => {
    try {
      setDisabled(true);
      await login();
    } catch (e) {
      console.log(e);
      setDisabled(false);
      setStatus('Something didnt work!');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={_login}
        disabled={disabled}
        className="button is-size-4-desktop bt5 has-text-white has-background-black has-text-weight-bold"
      >
        Connect with MetaMask
      </button>
      {
        disabled
        && (
          <div className="has">
            <div className="has-text-centered has-max-width-500 has-margin-auto">
              <p
                className="has-text-weight-bold mt-4"
              >
                Check the MetaMask Popup!
              </p>
              <p>
                Important: Please take note that this is a beta version and is provided on an "as is" and "as available" basis. NFT Admin does not give any warranties and will not be liable for any loss, direct or indirect through continued use of this website.
              </p>
            </div>
          </div>
        )
      }
      <p
        className="has-text-weight-bold mt-3"
      >
        { status }
      </p>
    </div>

  );
}

export default LoginButton;
