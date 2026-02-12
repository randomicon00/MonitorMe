import React, { Fragment, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Transition, Menu } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { classNames } from "../utils/common";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";

type SearchAndProfileProps = {
    name?: string;
};

const SearchAndProfile = (props: SearchAndProfileProps) => {
    const { data: session } = useSession();
    const buttonRef = useRef<any>(null);

    const handleSignOut = async () => {
        await signOut({ redirect: true });
    };

    return (
        <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="flex-1 flex">
                <SearchBar />
            </div>
            <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="ml-3 relative">
                    <div>
                        <Menu.Button
                            ref={buttonRef}
                            onBlur={(e: any) => e.currentTarget.blur()}
                            className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50"
                        >
                            <Image
                                className="h-8 w-8 rounded-full"
                                src="/images/placeholder.jpg"
                                alt=""
                                width={32}
                                height={32}
                            />
                            <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                                <span className="sr-only">Open user menu for </span>
                                {session?.user?.name || "User"}
                            </span>
                            <ChevronDownIcon
                                className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                                aria-hidden="true"
                            />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/settings"
                                        className={classNames(
                                            active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                    >
                                        Settings
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleSignOut}
                                        className={classNames(
                                            active ? "bg-gray-100" : "",
                                            "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                        )}
                                    >
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
};

export default SearchAndProfile;
