import Head from 'next/head';

import MintColourForm from '@components/colours/minting/MintColourForm/MintColourForm';
import HomeLayout from '@components/layouts/HomeLayout';

const MintColoursDashboard = () => {
  return (
    <div className="p-4">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Mint Colours</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold text-white text-center">
        Mint Colours
      </h1>

      <MintColourForm />
    </div>
  );
};

MintColoursDashboard.Layout = HomeLayout;

export default MintColoursDashboard;
