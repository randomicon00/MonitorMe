import React from "react";
import Image from "next/image";
import { OfficeBuildingIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { ACCOUNT } from "utils/constants";
import { useSession } from "next-auth/react";
import { getUsername } from "utils/common";

type UserHeadingProps = {
    name?: string;
};

const ProfileHeader = (props: UserHeadingProps) => {
    const { data: session } = useSession();

    return (
        <div className="flex items-center">
            <div>
                <div className="flex items-center">
                    <Image
                        className="h-16 w-16 rounded-full sm:hidden"
                        src="/images/placeholder.jpg"
                        width={40}
                        height={40}
                    />
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        Good day, {getUsername(session)}
                    </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    <dt className="sr-only">Company</dt>
                    <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                        <OfficeBuildingIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        {ACCOUNT.LOCATION}
                    </dd>
                    <dt className="sr-only">Account status</dt>
                    <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                        <CheckCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                            aria-hidden="true"
                        />
                        {ACCOUNT.VERIFIED}
                    </dd>
                </dl>
            </div>
        </div>
    );
};

export default ProfileHeader;
