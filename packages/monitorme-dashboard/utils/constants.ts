export const PER_PAGE = 10;

export const QUERY_PARAM_KEYS = {
    span: "spanpage",
    event: "eventpage",
    snapshot: "spanshotpage",
    session: "sessionpage",
    triggerroute: "triggerroute",
};

export const SKELETON_ROWS_COUNT = 8;
export const MIN_TIMEOUT = 200;

export const ACCOUNT = {
    LOCATION: "Remote",
    VERIFIED: "Verified Account",
};

const HOST = "http://localhost";
const PORT = "8888";

export const BASE_URL = `${HOST}:${PORT}`;

const FRONT_PORT = "3000";
export const BASE_FRONT_URL = `${HOST}:${FRONT_PORT}`;

const API_BY_SESSION_PATH: string[] = [
    "/api/events_by_session/",
    "/api/snapshots_by_session/",
    "/api/spans_by_session/",
];

const API_BY_SEGMENT_PATH: string[] = [
    "/api/spans_by_segment",
    "/api/events_by_segment",
];

const API_EVENTS_BY_SESSION_PATH: string[] = [
    "/api/events_by_session",
    "/api/snapshots_by_session",
];

export const API_EVENTS_BY_SESSION_URL = API_EVENTS_BY_SESSION_PATH.map(
    (path: string) => `${BASE_FRONT_URL}${path}`
);

export const API_BY_SESSION_URL: string[] = API_BY_SESSION_PATH.map(
    (path: string) => `${BASE_FRONT_URL}${path}`
);

export const API_BY_SEGMENT_URL: string[] = API_BY_SEGMENT_PATH.map(
    (path: string) => `${BASE_FRONT_URL}${path}`
);
