import { localizeTime, getStr } from "./common";

const EVENT_TYPES = [
  "DOM Content Loaded",
  "Load",
  "Full Snapshot",
  "Incremental Snapshot",
  "Meta",
  "Custom",
] as const;

const SOURCE_TYPES = [
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
] as const;

const INTERACTION_TYPES = [
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

type EventDetailsData = Record<string, any>;

interface EventDetails {
  type: number;
  timestamp: number;
  data: EventDetailsData;
}

interface Event {
  [key: string]: any;
  data: EventDetails;
}

export interface GriddableEvent {
  id: string; // number
  dateCreated: string;
  eventType: string;
  eventSource: string;
  eventSubtype: string;
  data: string;
}

// Extracts relevant data from the 'event.data' object
const extractEventData = (eventDetails: EventDetails) => {
  const evtDetails = parseEventDetails(eventDetails);

  //const evtSource = evtDetails.data.source; // SOURCE_TYPES[evtDetails.data.source];
  //const evtSubtype = evtDetails.data.type; // INTERACTION_TYPES[evtDetails.data.type];
  const { source: evtSource, type: evtSubtype } = evtDetails?.data ?? {};
  const { source, ...otherData } = eventDetails.data ?? {};

  return { evtDetails, evtSource, evtSubtype, otherData };
};

// Takes an event object and returns a new object containing
// the event's timestamp, type, and additional data.
const parseEventDetails = (eventDetails: EventDetails) => {
  // Set timestamp
  const details: Record<string, any> = {
    timestamp: eventDetails.timestamp,
  };

  // Set human readable type
  details.type = EVENT_TYPES[eventDetails.type] || "";

  // Set data if the type is 2, 4, or 5
  if ([2, 4, 5].includes(eventDetails.type)) {
    details.data = eventDetails.data;
  }
  // Process and set data if type is 3 (snapshot)
  if (eventDetails.type === 3) {
    details.data = processIncrementalSnapshot(eventDetails.data);
  }

  return details;
};

// Takes the data from an 'Incremental Snapshot' event and returns
// a new object with the source and its details.
const processIncrementalSnapshot = (data: EventDetailsData) => {
  const snapshot: Record<string, any> = {
    source: SOURCE_TYPES[data.source] || "",
  };

  switch (data.source) {
    case 0:
      processMutationDetails(snapshot, data);
      break;
    case 1:
      snapshot.positions = data.positions;
      break;
    case 2:
      addMouseInteractionDetails(snapshot, data);
      break;
    case 3:
      snapshot.data = data;
      break;
    case 4:
      const { width, height } = data;
      Object.assign(snapshot, { width, height });
      break;
    case 5:
      processInputDetails(snapshot, data);
      break;
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      snapshot.data = data;
      break;
    case 11:
      const { level, payload, trace } = data;
      Object.assign(snapshot, { level, payload, trace });
      break;
    case 12:
      snapshot.data = data;
      break;
    default:
      break;
  }

  return snapshot;
};

// Processes input-related data and adds the relevant fields to the object.
const processInputDetails = (obj: any, data: EventDetailsData) => {
  const { id, text, source, ...rest } = data;

  Object.assign(obj, { id, text, ...rest });
};

// Processes mutation-related data and adds relevant fields to the object.
const processMutationDetails = (obj: any, data: EventDetailsData) => {
  const { texts, attributes, removes, adds } = data;

  Object.assign(obj, { texts, attributes, removes, adds });
};

// Adds mouse interaction-related details to the object based on the event type.
const addMouseInteractionDetails = (obj: any, data: EventDetailsData) => {
  const { type: eventType, x, y, id } = data;
  let type = INTERACTION_TYPES[eventType] || "";

  Object.assign(obj, { x, y, id, type: type });
};

// Extracts and structures relevant grid properties from a given 'event' object
type MapEventToGrid = (event: Event) => GriddableEvent;

const mapEventToGrid: MapEventToGrid = ({ id, data }: Event) => {
  const { evtDetails, evtSource, evtSubtype, otherData } =
    extractEventData(data);

  const griddableEvent = {
    id, //: truncateString(String(evtDetails.timestamp), { numChars: 5 }),
    dateCreated: localizeTime(evtDetails.timestamp),
    eventType: evtDetails.type,
    eventSource: evtSource ?? "",
    eventSubtype: evtSubtype ?? "",
    data: getStr(otherData),
  } as GriddableEvent;

  return griddableEvent;
};

export default mapEventToGrid;
