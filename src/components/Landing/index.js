import React from 'react';

// Libraries
import { Helmet } from 'react-helmet-async';

// Components
import Navbar from 'components/layout/Navbar';
import Footer from 'components/layout/Footer';
import ContractManager from './ContractManager';
import Disclaimer from './Disclaimer';
import FAQ from './FAQ';

function Landing() {
  return (
    <>
      <Helmet>
        <title>NFT Admin - Manage your NFTs!</title>
      </Helmet>
      <div className="is-min-fullheight has-background-beige">
        <Navbar />

        <Disclaimer />

        <div className="">

          <div className="has-text-centered mt-6">
            <p
              className="has-text-black is-size-1 has-text-weight-bold"
            >
              NFT ADMIN - Manage your NFTs.
            </p>
            <p
              className="has-text-black is-size-3 has-text-weight-bold"
            >
              Approve. Transfer. Revoke.
            </p>
          </div>

          <ContractManager />

          <FAQ />

        </div>

      </div>
      <Footer />
    </>
  );
}

export default Landing;
