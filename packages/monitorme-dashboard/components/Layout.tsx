import { Fragment, ReactNode, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MenuAlt1Icon, XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";

import { navigation } from "../data/menu";
import SearchAndProfile from "./SearchAndProfile";
import PageHeader from "./PageHeader";
import path from "path";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useRouter();

  const getLinkClasses = (itemHref: string, currentPath: string) => {
    return itemHref === currentPath
      ? "bg-indigo-800 text-white group flex items-center px-2 py-2 text-base font-medium rounded-md"
      : "text-white hover:text-white hover:bg-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md";
  };

  return (
    <>
      <div className="min-h-full">
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                <button
                  type="button"
                  className="absolute top-0 right-0 -mr-12 pt-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Image
                    src="/images/monitor-me-white-complete.png"
                    alt="MonitorMe logo"
                    width={128}
                    height={32}
                  />
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a className={getLinkClasses(item.href, pathname)}>
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-200"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        {/* Static Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-indigo-700">
          <div className="flex items-center flex-shrink-0 px-4 pt-5">
            <Image
              src="/images/monitor-me-white-complete.png"
              alt="MonitorMe logo"
              width={128}
              height={32}
            />
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={getLinkClasses(item.href, pathname)}>
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-200"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <SearchAndProfile />
          </div>
          <main className="flex-1 pb-8">
            {/* Only render PageHeader on the homepage */}
            {pathname === "/" && <PageHeader />}
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
