import React from 'react';

function FAQ() {
  return (
    <div className="columns is-centered m-0 py-0 pb-6" id="faq">
      <div className="column is-6-desktop has-max-width-800">
        <div className="box p-5">
          <p
            className="has-text-weight-bold is-size-3-desktop"
          >
            FAQ
          </p>
          <p
            className="has-text-weight-bold is-size-4-desktop"
          >
            About NFT Admin
          </p>
          <div>
            <p
              className="has-text-weight-bold mt-3"
            >
              What is NFT Admin?
            </p>
            <p>
              With NFT Admin, you can manage your ERC 721 NFTs! Transfer them to a different wallet, approve addresses or revoke approval of a contract!
            </p>
          </div>

          <p
            className="has-text-weight-bold mt-3"
          >
            Why do I need NFT Admin?
          </p>
          <p>
            With NFT Admin, you can manage your ERC-721 NFTs all in one place!
          </p>

          <p
            className="has-text-weight-bold mt-3"
          >
            Is it safe to use NFT Admin?
          </p>
          <div>
            <p
              className="is-inline"
            >
              It is totally safe to use NFT Admin! You can review the source code
            </p>
            <a
              href="https://github.com/threeNULL/nftadmin"
              className="is-info has-text-underlined ml-1 is-inline"
              target="_blank"
              rel="noopener noreferrer"
            >
              here.
            </a>
          </div>

          <p
            className="has-text-weight-bold mt-3"
          >
            Does it cost anything?
          </p>
          <p>
            No! NFT Admin is completely free! Of course you have to pay gas fees if you&apos;re writing to a smart contract (Blockchain fee), but there are no additional fees from our side.
          </p>

          <div
            className="mt-5"
          >
            <p
              className="has-text-weight-bold is-size-4-desktop"
            >
              About Transfers
            </p>
            <div>
              <p
                className="has-text-weight-bold mt-3"
              >
                What is a transfer?
              </p>
              <p>
                A transfer is a contract method that lets you send your NFT to a different wallet or smart contract.
              </p>
            </div>
          </div>

          <div
            className="mt-5"
          >
            <p
              className="has-text-weight-bold is-size-4-desktop"
            >
              About Approvals
            </p>
            <div>
              <p
                className="has-text-weight-bold mt-3"
              >
                What is an approval?
              </p>
              <p>
                There are two type of approvals: Approval for ONE NFT for ONE transfer, or approval for ALL the NFTs that you own from this collection. On both occasions, you have to supply an address. That address will get the approval to transfer your NFT(s).
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p
              className="has-text-weight-bold is-size-4-desktop"
            >
              About Revocations
            </p>
            <div>
              <p
                className="has-text-weight-bold mt-3"
              >
                What is a revocation?
              </p>
              <p>
                A revocation is the opposite of an approval: The permission to transfer your NFT(s) is removed from an address.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>

  );
}

export default FAQ;
