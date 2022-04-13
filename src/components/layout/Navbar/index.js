import React from 'react';

// Components
import { Link } from 'react-router-dom';

// Constants
import * as routes from 'constants/routes';
import DonationDisplay from './DonationDisplay';

function Navbar() {
  return (
    <nav
      className="navbar has-no-border has-background-beige pt-6 px-6"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link
          to={routes.LANDING}
          className="navbar-item"
        >
          <p className="has-text-weight-bold has-text-black">
            NFT ADMIN
          </p>
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item px-1">
            <DonationDisplay />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
