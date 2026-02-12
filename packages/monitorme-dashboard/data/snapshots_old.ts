import { generateRandomTimestamp } from "./data";

type SnapShot = {
  sessionId: string;
  data:
    | {
        type: number;
        href: string;
        width: number;
        height: number;
        timestamp: number;
      }
    | string;
};

export const dbSnapshots = Array.from({ length: 100 }, (_, i) => {
  const snapshot: SnapShot = {
    sessionId: `${Math.floor(Math.random() * 5) + 1}`,
    data: {
      type: 4,
      href: `http://localhost:3000/${i}`,
      width: Math.floor(Math.random() * 1000) + 600,
      height: Math.floor(Math.random() * 800) + 600,
      timestamp: generateRandomTimestamp(1691000000000, 1695000000000),
    },
  };

  // encode the data using base64
  snapshot.data = Buffer.from(JSON.stringify(snapshot.data)).toString("base64");

  return snapshot;
});

export default dbSnapshots;
