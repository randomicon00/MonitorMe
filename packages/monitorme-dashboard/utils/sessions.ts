import { formatDuration, localizeTime } from "./common";

const isValidBase64 = (str: string) => {
  try {
    return Buffer.from(str, "base64").toString("base64") === str;
  } catch (err) {
    return false;
  }
};

type Event = {
  userId: string;
  sessionId: string;
  segmentId: string;
  data: Record<string, any>;
};

export const parseData = (events: Event[]) => {
  return events.map((event) => {
    let data = event.data;
    if (data !== undefined) {
      // Takes into account the fact that the data can be base64 encoded
      data = isValidBase64(data as any)
        ? JSON.parse(String(data as any))
        : JSON.parse(data as any);
      return {
        ...event,
        data,
      };
    }
  }) as Event[];
};

type SessionMetrics = {
  [sessionId: string]: {
    userId: string;
    earliestTimestamp: number;
    latestTimestamp: number;
  };
};

export const getSessionSummaries = (events: Event[]) => {
  const sessionMetrics = {} as SessionMetrics;

  events.forEach((event) => {
    let timestamp = event.data.timestamp;

    const session =
      sessionMetrics[event.sessionId] ||
      (sessionMetrics[event.sessionId] = {
        userId: event.userId,
        earliestTimestamp: timestamp,
        latestTimestamp: timestamp,
      });

    session.earliestTimestamp = Math.min(session.earliestTimestamp, timestamp);
    session.latestTimestamp = Math.max(session.latestTimestamp, timestamp);
  });

  return Object.entries(sessionMetrics).map(([sessionId, sessionData]) => {
    const duration =
      (sessionData.latestTimestamp - sessionData.earliestTimestamp) / 1000;
    return {
      id: sessionId,
      userId: sessionData.userId,
      startTime: localizeTime(sessionData.earliestTimestamp),
      duration: formatDuration(duration),
    };
  });
};
