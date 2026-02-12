const spanColumnNames = [
  "id", // span id
  "dateCreated",
  "serviceName",
  "spanType",
  "statusCode",
  "triggerRoute",
];

const spanIssuesColumnNames = [
  "id", // span id
  "dateCreated",
  "serviceName",
  "segmentId",
  "statusCode",
  "triggerRoute",
];

const eventColumnNames = [
  "id", // timestamp
  "dateCreated",
  "eventType",
  "eventSource",
  "eventSubtype",
  "data",
];

const eventIssuesColumnNames = [
  "id", // timestamp
  "dateCreated",
  "segmentId",
  "typeOfError",
  "payload",
];

const snapshotColumnNames = [
  "id", // timestamp
  "sessionId",
  "data",
];

const lastestColumnNames = ["id", "createdAt", "type", "sessionId"];

const sessionColumnNames = ["id", "userId", "startTime", "duration"];

const triggerRouteColumnNames = ["spanId", "triggerRoute"];

export {
  lastestColumnNames,
  spanColumnNames,
  spanIssuesColumnNames,
  eventColumnNames,
  eventIssuesColumnNames,
  snapshotColumnNames,
  sessionColumnNames,
  triggerRouteColumnNames,
};
