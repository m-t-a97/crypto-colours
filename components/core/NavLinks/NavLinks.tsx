import { useEffect, useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import RoutePaths from '@src/constants/route-paths';

type NavLinkInfoType = {
  iconPath: string;
  linkName: string;
  path: RoutePaths;
  mainColour: string;
  hoverColour: string;
};

const NavLinks = () => {
  const [navLinks, setNavLinks] = useState<NavLinkInfoType[]>([]);

  useEffect(() => {
    buildNavLinks();
  }, []);

  const buildNavLinks = () => {
    const navLinks: NavLinkInfoType[] = [
      {
        iconPath: "/icons/store-icon.svg",
        linkName: "MARKET PLACE",
        path: RoutePaths.MARKET_PLACE,
        mainColour: "bg-yellow-300",
        hoverColour: "bg-yellow-400",
      },
      {
        iconPath: "/icons/tools-icon.svg",
        linkName: "MINT COLOURS",
        path: RoutePaths.MINT_COLOURS,
        mainColour: "bg-green-300",
        hoverColour: "bg-green-400",
      },
      {
        iconPath: "/icons/collection-icon.svg",
        linkName: "MY COLOURS",
        path: RoutePaths.MY_COLOURS,
        mainColour: "bg-indigo-300",
        hoverColour: "bg-indigo-400",
      },
    ];

    setNavLinks(navLinks);
  };

  return (
    <div className="mt-14">
      <ul className="m-auto flex flex-col sm:flex-row justify-center items-center">
        {navLinks.map((info: NavLinkInfoType, index: number) => {
          return (
            <Link key={index} href={info.path}>
              <li
                className={classNames(
                  info.mainColour,
                  `hover:${info.hoverColour}`,
                  "w-48 mr-2 mb-4 sm:mb-0 p-4 rounded-sm cursor-pointer"
                )}
              >
                <div className="text-center">
                  <Image
                    src={info.iconPath}
                    alt="Ethereum Icon"
                    height={40}
                    width={40}
                  />
                </div>

                <p className="mt-4 text-base font-bold text-center">
                  {info.linkName}
                </p>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default NavLinks;
