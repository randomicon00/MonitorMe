import { localizeTime } from "./common";

// Helper function to filter spans with status_code >= 400
export const getErrorSpan = (span: { [key: string]: any }) => {
  /*if (span.statusCode >= 400) {
          //console.log(span);
      }*/
  return span.statusCode >= 400;
};

// Helper function to filter events with data level of 'error'
export const getErrorEvent = (event: { [key: string]: any }) => {
  if (!event || typeof event !== "object") {
    throw new Error("Invalid event object provided.");
  }

  const { data: eventData } = event;
  if (!eventData || typeof eventData !== "object") {
    return false;
  }

  const { type, data } = eventData;
  if (type !== 6 || !data || typeof data.payload !== "object") {
    return false;
  }

  return data.payload.level === "error";
};

export const getTotalErrors = (
  spans: { [key: string]: any }[],
  events: { [key: string]: any }[]
) => {
  const backendErrors = spans.filter(getErrorSpan).length;
  const clientErrors = events.filter(getErrorEvent).length;

  return {
    backendErrors,
    clientErrors,
  };
};

// Map event data to issue format
export const mapEventIssueToGrid = (event: { [key: string]: any }) => {
  if (!event) {
    throw new Error("Invalid event object provided.");
  }

  const { id, segmentId = "", data = {} } = event;
  const { timestamp = "", payload = "" } = data.data;

  return {
    id,
    dateCreated: localizeTime(timestamp) ?? "",
    segmentId: segmentId ?? "",
    typeOfError: payload.level ?? "",
    payload: payload.payload ?? "",
  };
};

// Map span data to issue format
export const mapSpanIssueToGrid = (span: { [key: string]: any }) => {
  if (!span) {
    throw new Error("Invalid span object provided.");
  }

  const {
    spanId = "",
    sentAt = 0,
    segmentId = "",
    statusCode = "",
    triggerRoute = "",
    data = {},
  } = span;

  return {
    id: spanId || "",
    dateCreated: sentAt ? localizeTime(sentAt / 1000) : "",
    serviceName: data["service.name"] ?? "",
    segmentId,
    statusCode,
    triggerRoute,
  };
};
