import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { NextPageWithLayout } from "pages/_app";
import Layout from "components/Layout";
import { getReplayableEvents } from "utils/session";
import RRWebPlayer from "components/RRWebPlayer";
import Button from "components/Button";
import { requireAuth } from "utils/auth";
import { ArrowCircleLeftIcon } from "@heroicons/react/solid";

type SessionReplayProps = {
  sessionId: string;
  replayableEvents: Array<Record<string, any>>;
};

const SessionReplay: NextPageWithLayout<SessionReplayProps> = ({
  sessionId,
  replayableEvents,
}) => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="my-8 text-lg leading-6 font-medium text-gray-900 text-left">
          Session Replay <span className="text-sm ">{sessionId}</span>
        </h2>
        <Button
          onClick={goBack}
          variant="secondary"
          Icon={ArrowCircleLeftIcon}
          iconPosition="left"
          customClass="mb-4"
        >
          Go Back
        </Button>
      </div>

      {/* Player */}
      <div className="flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="rrweb-player" className="max-h-100 m-auto">
          <RRWebPlayer events={replayableEvents} />
        </div>
      </div>
    </div>
  );
};

export default SessionReplay;

SessionReplay.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { id: sessionId } = context.query;

    try {
      const replayableEvents = await getReplayableEvents(sessionId as string);

      return {
        props: {
          sessionId,
          replayableEvents: replayableEvents ?? [],
        },
      };
    } catch (error) {
      console.error("Error fetching replayable events:", error);
      return {
        props: {
          sessionId,
          replayableEvents: [],
        },
      };
    }
  }
);
