// list all the real urls
// spans, events, snapshots, trigger routes
// all the rest is generated

const codes = ["201", "302", "400", "502"];

export const normalizeStr = (s: string) => {
  return s
    .trim()
    .toLowerCase()
    .replace(/[_-\s]+/g, "");
};

export const eventColumnNames = [
  "Span Id",
  "Date",
  "Service",
  "Segment Id",
  "Status Code",
  "Trigger Route",
];

/* Start Events Generation */
import { randomBytes } from "crypto";

const getRandomUserId = () => Math.floor(Math.random() * 10) + 1;

export const generateRandomTimestamp = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

const eventTypes = ["1", "2", "3", "4"];
const eventSources = ["mouse", "keyboard", "touchpad", "voice"];
const eventSubtypes = ["1", "2", "3", "4", "5", "6"];

// TODO This is an already transformed data
// Need to include the event parser in this step as well.
// Need to generate the raw event here.
export const events = [...Array(50)].map((_, i) => ({
  id: getRandomUserId(),
  spanid: `${i}3434Fdf32`,
  href: "#",
  segmentid: `${i}3870ffde48`,
  triggerroute: `/spans/${i % 2}/some`,
  statuscode: codes[i % 4],
  service: `shopping cart ${i}`,
  date_created: generateRandomTimestamp(1630000000000, 1639999999999),
  event_type: eventTypes[i % 4],
  event_source: eventSources[i % 4],
  event_subtype: eventSubtypes[i % 6],
  base64_data: randomBytes(10).toString("base64"),
}));
/* End of Events Generation */
export const spanColumnNames = [
  "Span Id",
  "Date",
  "Service",
  "Segment Id",
  "Status Code",
  "Trigger Route",
  "Type",
  "Request Data",
];

export const spans = [...Array(50)].map((_, i) => ({
  id: i,
  spanid: `${i}3434Fdf32`,
  href: "#",
  segmentid: `${i}3870ffde48`,
  triggerroute: `/spans/${i}/some`,
  statuscode: codes[i % 4],
  service: `shopping cart ${i}`,
  date: "July 11, 2020",
  datetime: "2020-07-11",
  type: `type ${i}`,
  requestdata: `somedt${i}`,
}));

export const issuesColumnNames = [
  "Span Id",
  "Date",
  "Service",
  "Segment Id",
  "Status Code",
  "Trigger Route",
];

export const eventIssuesColumnNames = [
  "id", // timestamp
  "dateCreated",
  "segmentId",
  "typeOfError",
  "payload",
];
export const spanIssuesColumnNames = [
  "id", // spanId
  "dateCreated",
  "serviceName",
  "segmentId",
  "statusCode",
  "triggerRoute",
];

export const issues = [...Array(50)].map((_, i) => ({
  id: i,
  spanid: `${i}3434Fdf32`,
  href: "#",
  segmentid: `${i}3870ffde48`,
  triggerroute: `/spans/${i}/some`,
  statuscode: codes[i % 4],
  service: `shopping cart ${i}`,
  date: "July 11, 2020",
  datetime: "2020-07-11",
  type: `type ${i}`,
  requestdata: `somedt${i}`,
}));

export const triggerRouteColumnNames = ["Span Id", "Trigger Route"];
export type TriggerRoute = {
  spanId: string;
  triggerRoute: string;
  data: { [key: string]: any };
};
export const triggerRoutes = [...Array(20)].map((_, i) => ({
  spanId: `${i}3434Fdf32`,
  triggerRoute: `/spans/${i}/some`,
  data: "json encoded data!",
}));

export const sessionColumnNames = ["Id", "User Id", "Start Time", "Duration"];
export const sessions = [...Array(40)].map((_, idx) => ({
  id: idx,
  userid: `user${idx}`,
  starttime: "July 11, 2020",
  duration: 3 * idx,
}));

/*
import timeParser from "./timeParser";
import eventParser from "./eventParser";

const eventGridProperties = (event) => {
  const { data } = event;
  const { source, ...dataData } = data.data;
  const details = eventParser(event.data);

  let eventSource = '';
  let eventSubtype = '';
  if (details.data) {
    eventSource = details.data.source;
    eventSubtype = details.data.type;
  }
  return {
    id: details.timestamp,
    date_created: timeParser(details.timestamp),
    event_type: details.type,
    event_source: eventSource,
    event_subtype: eventSubtype,
    data: JSON.stringify(dataData),
  };
};

export default eventGridProperties;
*/

// Example event objects
//
/*const event_t4 = {
  userId: "3",
  sessionId: "303",
  segmentId: "283",

  data: {
    type: 4,
    data: {
      source: 2,
      href: "http://localhost:3000/",
      width: 808,
      height: 722,
      timestamp: 303033032,
    },
  },
};

/*
const mapEventToGridProperties = (event) => {
  const { data } = event;
  
  const { source, ...remainingEventData } = data.data;
  const parsedDetails = parseEvent(event.data);

  let eventSource = '';
  let eventSubtype = '';
  if (parsedDetails.data) {
    eventSource = parsedDetails.data.source;
    eventSubtype = parsedDetails.data.type;
  }
  return {
    id: parsedDetails.timestamp,
    dateCreated: parseTime(parsedDetails.timestamp),
    eventType: parsedDetails.type,
    eventSource,
    eventSubtype,
    data: JSON.stringify(remainingEventData),
  };
};

mappedGridEvent = {
  id: evt.data.timestamp, 
  dateCreated: timeParser(evt.data.timestamp),
  eventType: evt.data.type,
  eventSource: evt.data.source,
  eventSubType: evt.data.data.type,
  data: JSON.stringify(evt.data.otherData),
}
*/

/*
const event_t3 = {
  userId: "393",
  sessionId: "dd9d",
  segmentId: "3933",

  data: {
    type: 3,
    data: {
      source: 1,
      positions: [
        {
          x: 750,
          y: 499,
          id: 40,
          timeOffset: -452,
        },
      ],
    },
  },
};
*/

const dbSpans = {};

// Generate these events
const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * 1000),
    y: Math.floor(Math.random() * 800),
    id: Math.floor(Math.random() * 50) + 1,
    timeOffset: Math.floor(Math.random() * 1000) - 500,
  };
};

function generateRandomPayload() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 10 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}

// Events of type 3 and 4 generation with random payload added
const events_t3 = Array.from({ length: 80 }, (_, i) => ({
  type: 3,
  data: {
    source: Math.floor(Math.random() * 5) + 1,
    positions: [getRandomPosition()],
    timestamp: generateRandomTimestamp(1694000000000, 1695000000000),
    payload: generateRandomPayload(), // Added random payload
  },
}));

const events_t4 = Array.from({ length: 120 }, (_, i) => ({
  type: 4,
  data: {
    href: `http://localhost:3000/${i}`,
    width: Math.floor(Math.random() * 1000) + 600,
    height: Math.floor(Math.random() * 800) + 600,
    timestamp: generateRandomTimestamp(1694000000000, 1695000000000),
    payload: generateRandomPayload(), // Added random payload
  },
}));

const events_t3_error = Array.from({ length: 50 }, (_, i) => ({
  type: 3,
  data: {
    source: Math.floor(Math.random() * 5) + 1,
    positions: [getRandomPosition()],
    level: "error",
    timestamp: generateRandomTimestamp(1694000000000, 1695000000000),
    payload: generateRandomPayload(), // Added random payload
  },
}));

const events_t4_error = Array.from({ length: 50 }, (_, i) => ({
  type: 4,
  data: {
    href: `http://localhost:3000/${(i + 120) % 10}`,
    width: Math.floor(Math.random() * 1000) + 600,
    height: Math.floor(Math.random() * 800) + 600,
    level: "error",
    timestamp: generateRandomTimestamp(1694000000000, 1695000000000),
    payload: generateRandomPayload(), // Added random payload
  },
}));

const allEvents: any[] = [];
for (let i = 0; i < 5; i++) {
  allEvents.push(
    events_t3[i],
    events_t4[i],
    events_t3_error[i],
    events_t4_error[i]
  );
}

// encrypt the events and include the following fields:
// user_id, session_id, segment_id (randomly generated)
// encode all the other fields using base64
const dbEvents = allEvents.map((event, i) => {
  const encodedData = Buffer.from(JSON.stringify(event.data)).toString(
    "base64"
  );
  return {
    userId: `${i % 10}`,
    sessionId: `${i % 12}`,
    segmentId: `${i % 5}`,
    data: encodedData,
  };
});

//console.log(dbEvents);
export { dbEvents };
