import ProfileHeader from "./ProfileHeader";
import Button from "./Button";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

type PageHeaderProps = {
  name?: string;
};

const PageHeader = (props: PageHeaderProps) => {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const handleLogoutClick = async () => {
    await signOut({ redirect: true });
  };

  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <ProfileHeader />
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <Button onClick={handleSettingsClick} variant="primary">
              Edit Profile
            </Button>
            <Button onClick={handleLogoutClick} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
