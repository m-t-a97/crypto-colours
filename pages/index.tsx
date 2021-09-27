import Head from 'next/head';

import NavLinks from '@components/core/NavLinks/NavLinks';
import HomeLayout from '@components/layouts/HomeLayout';

const Home = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col justify-start items-center py-2">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavLinks />
    </div>
  );
};

Home.Layout = HomeLayout;

export default Home;
