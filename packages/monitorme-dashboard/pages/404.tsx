import type { NextPage } from "next";

import NotFound from "../components/NotFound";

const FourOFour: NextPage = () => {
  return (
    <>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <NotFound />
      </div>
    </>
  );
};

export default FourOFour;
