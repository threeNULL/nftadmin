import React from 'react';

// Libraries
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Constants
import * as routes from 'constants/routes';

// Provider
import { Web3Provider } from './context/Web3Context';

// Components
import Landing from 'components/Landing';
import NotFound from 'components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Web3Provider>
          <Helmet>
            <title>NFT Admin - Manage your NFTs.</title>
          </Helmet>
          <Routes>
            <Route
              path={routes.LANDING}
              element={<Landing />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Web3Provider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
