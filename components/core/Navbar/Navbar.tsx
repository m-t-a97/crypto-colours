import { useEffect } from 'react';

import Link from 'next/link';

import SvgTooltipIcon from '@components/shared/SvgTooltipIcon/SvgTooltipIcon';

import RoutePaths from '@src/constants/route-paths';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';

const Navbar = () => {
  const { account }: WalletAccountType = useWalletAccount();

  useEffect(() => {}, []);

  return (
    <div className="mb-4 p-4 flex flex-row justify-between items-center bg-gray-700">
      <div>
        <Link href={RoutePaths.HOME}>
          <a className="text-lg sm:text-2xl font-bold text-blue-400 underline">
            {process.env.NEXT_PUBLIC_APP_NAME.toUpperCase()}
          </a>
        </Link>
      </div>

      <div className="bg-white rounded-md">
        <SvgTooltipIcon data={account} size={50} />
      </div>
    </div>
  );
};

export default Navbar;
