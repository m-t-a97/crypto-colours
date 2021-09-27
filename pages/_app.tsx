import '@styles/styles.scss';

import ContractsContextProvider from '@src/context/blockchain/ContractsContextProvider';
import WalletAccountContextProvider from '@src/context/blockchain/WalletAccountContextProvider';
import Web3ContextProvider from '@src/context/blockchain/Web3ContextProvider';

const App = ({ Component, pageProps }) => {
  const Layout = Component.Layout || DefaultLayout;

  return (
    <Web3ContextProvider>
      <WalletAccountContextProvider>
        <ContractsContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContractsContextProvider>
      </WalletAccountContextProvider>
    </Web3ContextProvider>
  );
};

const DefaultLayout = ({ children }) => <>{children}</>;

export default App;
