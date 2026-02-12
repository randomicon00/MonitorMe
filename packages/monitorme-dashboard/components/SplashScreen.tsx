import Image from "next/image";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <Image
          src="/images/monitor-me-white-complete.png"
          alt="MonitorMe Logo"
          width={160}
          height={40}
        />
        <div className="mt-4 text-lg font-semibold text-gray-500">
          Loading, please wait...
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
