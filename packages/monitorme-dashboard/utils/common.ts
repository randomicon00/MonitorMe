import { Session } from "next-auth";
import moment from "moment-timezone";

export const getUsername = (session: Session | null) => {
  return session?.user?.name ?? "Anonymous User";
};

export function getPageNumber(page: string | string[] | undefined) {
  if (Array.isArray(page) || page === undefined || page.trim() === "") {
    return 1;
  }

  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return pageNumber;
}

export async function fetchApiData(endpoint: string, id: string) {
  const response = await fetch(`${endpoint}/${id}`);
  return await response.json();
}

export const parseBase64ToJSON = (data: string) => {
  const decodedString = Buffer.from(data, "base64").toString();
  if (decodedString === "undefined" || !decodedString) {
    return null;
  }
  const parsedDecodedString = JSON.parse(decodedString);
  return parsedDecodedString;
};

export const paginate = <T>(
  array: T[],
  currentPage: number,
  perPage: number
): T[] => {
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  return array.slice(startIndex, endIndex);
};

interface TruncateStringOpts {
  numChars?: number;
  reverse?: boolean;
}

export const truncateString = (
  word: string | number,
  opts: TruncateStringOpts
) => {
  if (typeof word !== "string" && typeof word !== "number") {
    throw new TypeError('Input "word" must be a string or number.');
  }

  if (!opts || typeof opts !== "object") {
    throw new TypeError('Options "opts" must be an object.');
  }

  const { numChars, reverse } = opts;

  if (
    numChars !== undefined &&
    (typeof numChars !== "number" || numChars < 0)
  ) {
    throw new RangeError(
      '"numChars" must be a non-negative number if provided.'
    );
  }

  if (reverse !== undefined && typeof reverse !== "boolean") {
    throw new TypeError('"reverse" must be a boolean if provided.');
  }

  // Convert number to string if necessary
  const strWord = typeof word === "number" ? word.toString() : word;

  const truncateLength = numChars ?? strWord.length;

  // Handle edge cases
  if (truncateLength === 0 || strWord.length === 0) {
    return "";
  }

  if (truncateLength >= strWord.length) {
    return strWord;
  }

  // Perform truncation
  return reverse
    ? strWord.slice(-truncateLength) // Take characters from the end
    : strWord.slice(0, truncateLength); // Take characters from the beginning
};

export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(" ");

export const normalizeStr = (s: string) => {
  return s
    .trim()
    .toLowerCase()
    .replace(/[_-\s]+/g, "");
};

export const localizeTime = (timestamp: number, tz = "America/Los_Angeles") =>
  moment(timestamp).tz(tz).format("MM/DD hh:mm:ss");

export const formatDuration = (durationInSeconds: number) => {
  return new Date(durationInSeconds * 1000).toISOString().substr(11, 8);
};

export const tryParseJSON = (data: string) => {
  const decodedStr = Buffer.from(data, "base64").toString();
  try {
    return decodedStr && decodedStr !== "undefined"
      ? JSON.parse(decodedStr)
      : null;
  } catch (e) {
    return decodedStr;
  }
};

// TODO: merge parseEvents and parseSpans
// into one function that takes the type as an argument
export const parseEvents = (events: any[]) => {
  return events.map((event) => {
    const { data, ...rest } = event;
    return {
      ...rest,
      data: tryParseJSON(data),
    };
  });
};
export const parseSpans = (spans: any[]) => {
  return spans.map((span) => {
    const { data, ...rest } = span;
    return {
      ...rest,
      data: tryParseJSON(data),
    };
  });
};

export const getStr = (data: string | Record<string, any> | null | undefined) =>
  typeof data === "string" ? data : data ? JSON.stringify(data) : null;

// Extracts relevant data from the 'event.data' object
export const extractEventData = (data: any) => {
  const evtDetails = parseEventDetails(data);
  const { source, ...otherData } = data.data;
  const { evtSource = "", evtSubtype = "" } = evtDetails.data || {};
  return { evtDetails, evtSource, evtSubtype, otherData };
};

const eventTypes = [
  "DOM Content Loaded",
  "Load",
  "Full Snapshot",
  "Incremental Snapshot",
  "Meta",
  "Custom",
];

const sourceTypes = [
  "Mutation",
  "Mouse Move",
  "Mouse Interaction",
  "Scroll",
  "Viewport Resize",
  "Input",
  "Touch Move",
  "Media Interaction",
  "Style Sheet Rule",
  "Canvas Mutation",
  "Font",
  "Log",
  "Drag",
];

const interactionTypes = [
  "Mouse Up",
  "Mouse Down",
  "Click",
  "Context Menu",
  "Double Click",
  "Focus",
  "Blur",
  "Touch Start",
  "Touch Move Departed",
  "Touch End",
];

// Takes an event object and returns a new object containing
// the event's timestamp, type, and additional data.
const parseEventDetails = (event: any) => {
  const details = {
    timestamp: event.timestamp,
  } as { timestamp: number; type: string; data?: any };

  details.type = eventTypes[event.type] || "";

  if ([2, 4, 5].includes(event.type)) {
    details.data = event.data;
  }
  if (event.type === 3) {
    details.data = processIncrementalSnapshot(event.data);
  }

  return details;
};

// Takes the data from an 'Incremental Snapshot' event and returns
// a new object with the source and its details.
const processIncrementalSnapshot = (data: any) => {
  const snapshot = {} as { source: string; id?: string; type?: string };

  snapshot.source = sourceTypes[data.source] || "";
  const { source, ...rest } = data;

  if (data.source === 2) {
    addMouseInteractionDetails(snapshot, rest);
    snapshot.id = data.id;
  } else if (data.source === 5) {
    processInputDetails(snapshot, rest);
  } else {
    Object.assign(snapshot, rest);
  }

  return snapshot;
};

// Takes an object and data related to 'Mouse Interaction'. It modifies
// the object to include specific details like mouse type and positions.
const addMouseInteractionDetails = (
  obj: { [key: string]: any },
  data: {
    type: any;
    [key: string]: any;
  }
) => {
  obj.type = interactionTypes[data.type] || "";
  const { type, ...rest } = data;
  Object.assign(obj, rest);
};

// Takes an object and data for 'Input' type events, and enriches the object
// with additional fields from the data.
const processInputDetails = (
  obj: { [key: string]: any },
  data: {
    source: any;
    text: any;
    id: any;
    [key: string]: any;
  }
) => {
  const { source, text, id, ...rest } = data;
  Object.assign(obj, rest);
};
