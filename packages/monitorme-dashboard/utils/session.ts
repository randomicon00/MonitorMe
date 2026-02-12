//import { spans } from "data/data";
import { fetchApiData } from "./common";
import { API_BY_SESSION_URL, API_EVENTS_BY_SESSION_URL } from "./constants";

const extractDataFromEvents = (events: Record<string, any>[]) => {
  return events.map((event) => event.data);
};

export async function getSessionData(sessionId: string | string[] | undefined) {
  if (!sessionId || Array.isArray(sessionId)) {
    throw new Error("Invalid sessionId");
  }

  const [
    { data: eventsBySessionId },
    { data: snapshotsBySessionId },
    { data: spansBySessionId },
  ] = await Promise.all(
    API_BY_SESSION_URL.map((url) => fetchApiData(url, sessionId))
  );

  const replayableEvents = [
    ...extractDataFromEvents(eventsBySessionId),
    ...extractDataFromEvents(snapshotsBySessionId),
  ];

  return [
    eventsBySessionId,
    snapshotsBySessionId,
    spansBySessionId,
    replayableEvents,
  ];
}

// Fetch events and snapshots for replayable events
export async function getReplayableEvents(sessionId: string) {
  if (!sessionId) {
    throw new Error("Invalid sessionId");
  }

  const [{ data: eventsBySession }, { data: snapshotsBySession }] =
    await Promise.all(
      API_EVENTS_BY_SESSION_URL.map((url) => fetchApiData(url, sessionId))
    );

  return [
    ...extractDataFromEvents(eventsBySession),
    ...extractDataFromEvents(snapshotsBySession),
  ];
}

export async function getDataBySesssionId(
  sessionId: string | string[] | undefined
) {
  if (!sessionId || Array.isArray(sessionId)) {
    throw new Error("Invalid sessionId");
  }
  // ... rest of func
  const [
    { data: eventsBySessionId },
    { data: snapshotsBySessionId },
    { data: spansBySessionId },
  ] = await Promise.all(
    API_BY_SESSION_URL.map((url) => fetchApiData(url, sessionId))
  );

  return {
    events: eventsBySessionId,
    snapshots: snapshotsBySessionId,
    spans: spansBySessionId,
  };
}
