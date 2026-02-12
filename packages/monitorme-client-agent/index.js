import { getRecordConsolePlugin, record } from "rrweb";
import { v4 as uuidv4 } from "uuid";
import fetchIntercept from "fetch-intercept";
import config from "./config.json";

const buildSessionHeaders = (
  isIntercept = false,
  url = "",
  method = "",
  requestData = {},
) => {
  const sessionToken = ensureValidSessionToken();

  const headers = {
    "x-session-id": sessionToken.id,
    "x-segment-id": sessionStorage.getItem("segmentId"),
    "x-user-id": localStorage.getItem("userId"),
    authorization: `Bearer ${config.authToken}`,
    "content-type": "application/json",
  };
  if (isIntercept) {
    headers["x-trigger-route"] = `${method} ${url}`;
    headers["x-request-data"] = JSON.stringify(requestData);
  }

  return headers;
};

// Function to send rrweb event data to the backend
const sendRrwebEventData = (eventData, endpoint) => {
  const headers = buildSessionHeaders();
  headers["x-rrweb"] = "true"; // Marks the request as an rrweb event

  fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.statusText} from ${endpoint}`,
        );
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Error sending rrweb event data to ${endpoint} :`, error);
    });
};

// Determine the appropriate endpoint for rrweb events
const getRrwebEventEndpoint = (eventType) => {
  return eventType === 2 ? config.snapshotEndpoint : config.eventEndpoint;
};

// Initialize rrweb event recording
const startRrwebRecording = () => {
  record({
    emit(event) {
      sendRrwebEventData(event, getRrwebEventEndpoint(event.type));
    },
    sampling: config.samplingConfig,
    checkoutEveryNth: config.snapshotInterval,
    plugins: [getRecordConsolePlugin({ level: ["error"] })],
  });
};

// Reset session token and segment id
const resetSessionData = () => {
  const expirationDate = new Date(Date.now() + 1 * 3 * 1000).toISOString(); // 5 minutes expiration
  const newSessionToken = { id: uuidv4(), expirationDate };

  sessionStorage.setItem("sessionToken", JSON.stringify(newSessionToken));
};

// Ensure the session token exists and is valid
const ensureValidSessionToken = () => {
  let sessionToken = JSON.parse(sessionStorage.getItem("sessionToken"));

  if (!sessionToken || new Date(sessionToken.expirationDate) < new Date()) {
    resetSessionData();
    sessionToken = JSON.parse(sessionStorage.getItem("sessionToken"));
  }

  return sessionToken;
};

// Ensure segment ID exists in session storage
const ensureSegmentId = () => {
  if (!sessionStorage.getItem("segmentId")) {
    sessionStorage.setItem("segmentId", uuidv4());
  }
};

// Ensure user ID exists in local storage
const ensureUserId = () => {
  if (!localStorage.getItem("userId")) {
    localStorage.setItem("userId", uuidv4());
  }
};

const resetSegmentId = () => {
  sessionStorage.setItem("segmentId", uuidv4());
};

// Register fetch intercept logic
fetchIntercept.register({
  request: function (url, config = {}) {
    config.headers = config.headers || {};
    const method = config.method || "GET";

    //const requestData = config.body ? JSON.parse(config.body) : {};
    const requestData =
      typeof config.body === "string" && config.body.trim() !== ""
        ? JSON.parse(config.body)
        : {};
    // Add custom session headers unless this is an rrweb event
    if (config.headers["x-rrweb"] !== "true") {
      const sessionHeaders = buildSessionHeaders(
        true,
        url,
        method,
        requestData,
      );
      resetSegmentId();
      config.headers = { ...config.headers, ...sessionHeaders };
    } else {
      // Remove the x-rrweb header after processing
      delete config.headers["x-rrweb"];
    }

    return [url, config];
  },

  requestError: function (error) {
    return Promise.reject(error);
  },

  response: function (response) {
    return response;
  },

  responseError: function (error) {
    return Promise.reject(error);
  },
});

// Initialize the event tracker
const sessionEventTracker = {
  initialize() {
    // Ensure session data and IDs are set
    ensureValidSessionToken();
    ensureSegmentId();
    ensureUserId();

    // Start rrweb event recording
    startRrwebRecording();
  },
};

export default sessionEventTracker;
