const generateDeterministicId = (index: number): string => {
  const baseId = "11a20a0af4c246f3a5e7dbe5cdb0ac"; // Fixed part of the ID
  const uniquePart = index.toString().padStart(2, "0"); // Make sure it's always 2 digits
  return `${baseId}${uniquePart}`; // Combine the base with the unique part
};

const zipkinSpan = {
  id: "24b1a5a42d8e85bd" /* span id */,
  traceId: "3ee60e6f996601148c8a9256ccdaa3b2",
  timestamp: 1627833994314485,
  duration: 80304,

  tags: {
    "http.request_content_length_uncompressed": "15",
    "http.status_text": "OK",
    "service.name": "your-service-name",
    "http.host": "localhost:5000",
    frontendUser: "11a20a0a-f4c2-46f3-a5e7-dbe5cdb0ac23",
    frontendSession: "7ff82864-bd5b-4bcc-8699-53d773b7479d",
    frontendSegment: "d5bb6090-a764-4a63-9c26-c4918517f6b4",
    triggerRoute: "put /api/products/60c6d08a403cd5001c5563be",
    "net.peer.ip": "::ffff",
    "telemetry.sdk.language": "nodejs",
    "telemetry.sdk.version": "0.21.0",
    "http.method": "PUT",
    "http.route": "/api/products/60c6d08a403cd5001c5563be",
    "net.host.ip": "::ffff",
    "net.peer.port": "50134",
    "http.url": "http://localhost:5000/api/products/60c6d08a403cd5001c5563be",
    "net.host.name": "localhost",
    "http.user_agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
    "ot.status_code": "OK",
    requestData: "eyJxdWFudGl0eSI6NDh9",
  },
} as Partial<any>;

const decodedData = zipkinSpan.tags;
delete decodedData.requestData;

const encodedData = Buffer.from(JSON.stringify(decodedData)).toString("base64");
const dbSpans = {
  traceId: "3ee60e6f996601148c8a9256ccdaa3b2",
  spanId: "24b1a5a42d8e85bd",
  timeSent: 1627833994314485,
  duration: 80304,
  sessionId: "7ff82864-bd5b-4bcc-8699-53d773b7479d",
  userId: "11a20a0a-f4c2-46f3-a5e7-dbe5cdb0ac23",
  segmentId: "d5bb6090-a764-4a63-9c26-c4918517f6b4",
  triggerRoute: "put /api/products/60c6d08a403cd5001c5563be",
  requestData: "ABCDEFGHIJKLMNOPQjklmnopqrstuvwxyz0123456789+/",
  statusCode: 200,
  data: encodedData,
};
/*const decodeData = Buffer.from(encodedData, "base64").toString(
  "utf-8"
);*/

const spanInformation = {
  span_id: "24b1a5a42d8e85bd",
  session_id: "7ff82864-bd5b-4bcc-8699-53d773b7479d",
  time_sent: 1627833994314485,
  segment_id: "d5bb6090-a764-4a63-9c26-c4918517f6b4",
  request_data: "eyJxdWFudGl0eSI6NDh9",
  status_code: 200,
  time_duration: "80ms304us",
  trace_id: "3ee60e6f996601148c8a9256ccdaa3b2",
  trigger_route: "put /api/products/60c6d08a403cd5001c5563be",
  user_id: "11a20a0a-f4c2-46f3-a5e7-dbe5cdb0ac23",
  data: {
    "http.request_content_length_uncompressed": "15",
    "http.status_text": "OK",
    "service.name": "your-service-name",
    "http.host": "localhost:5000",
    frontendUser: "11a20a0a-f4c2-46f3-a5e7-dbe5cdb0ac23",
    triggerRoute: "put /api/products/60c6d08a403cd5001c5563be",
    "net.peer.ip": "::ffff:127.0.0.1",
    "telemetry.sdk.language": "nodejs",
    "telemetry.sdk.version": "0.21.0",
    "http.method": "PUT",
    "http.route": "/api/products/60c6d08a403cd5001c5563be",
    "net.host.ip": "::ffff:127.0.0.1",
    "net.peer.port": "50134",
    "http.url": "http://localhost:5000/api/products/60c6d08a403cd5001c5563be",
    "net.host.name": "localhost",
    "http.user_agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
    "ot.status_code": "OK",
    "http.client_ip": "127.0.0.1",
    "http.flavor": "1.1",
    "http.status_code": "200",
    "http.target": "/api/products/60c6d08a403cd5001c5563be",
    "net.transport": "IP.TCP",
    frontendSegment: "d5bb6090-a764-4a63-9c26-c4918517f6b4",
    "net.host.port": "5000",
    "telemetry.sdk.name": "opentelemetry",
    frontendSession: "7ff82864-bd5b-4bcc-8699-53d773b7479d",
  },
};

// for generating random uuids
import { v4 as uuidv4 } from "uuid";

const generateDbSpan = (index) => {
  const tags = {
    "http.request_content_length_uncompressed": "15",
    "http.status_text": "OK",
    "service.name": "billing",
    "http.host": "localhost:5000",
    frontendUser: "11a20a0a-f4c2-46f3-a5e7-dbe5cdb0ac23",
    frontendSession: "7ff82864-bd5b-4bcc-8699-53d773b7479d",
    frontendSegment: "d5bb6090-a764-4a63-9c26-c4918517f6b4",
    triggerRoute: "put /api/products/60c6d08a403cd5001c5563be",
    "net.peer.ip": "::ffff",
    "telemetry.sdk.language": "nodejs",
    "telemetry.sdk.version": "0.21.0",
    "http.method": "PUT",
    "http.route": "/api/products/1",
    "net.host.ip": "::ffff",
    "net.peer.port": "50134",
    "http.url": "http://localhost:5000/api/products/1",
    "net.host.name": "localhost",
    "http.user_agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
    "ot.status_code": "OK",
  };

  const encodedData = Buffer.from(JSON.stringify(tags)).toString("base64");

  return {
    traceId: uuidv4().replace(/-/g, ""),
    spanId: generateDeterministicId(index), //uuidv4().replace(/-/g, "").substring(0, 16),
    timeSent: Date.now() * 1000 + Math.floor(Math.random() * 1000),
    duration: Math.floor(Math.random() * 100000),
    sessionId: uuidv4().replace(/-/g, "").slice(0, 10),
    userId: uuidv4().replace(/-/g, "").slice(0, 10),
    segmentId: uuidv4().replace(/-/g, "").slice(0, 10),
    triggerRoute:
      "put /api/products/" + uuidv4().replace(/-/g, "").slice(0, 10),
    requestData: Buffer.from(
      JSON.stringify({ quantity: Math.floor(Math.random() * 100) })
    ).toString("base64"),
    statusCode: [200, 201, 204, 301, 304, 400, 401, 403, 404, 500][
      Math.floor(Math.random() * 10)
    ],
    data: encodedData,
  };
};

const dbSpans2 = Array.from({ length: 50 }, (_, i) => generateDbSpan(i + 1));

// Duplicate some userId, sessionId, and segmentId
for (let i = 0; i < 10; i++) {
  const j = Math.floor(Math.random() * 50);
  const k = Math.floor(Math.random() * 50);
  dbSpans2[j].userId = dbSpans2[k].userId;
  dbSpans2[j].sessionId = dbSpans2[k].sessionId;
  dbSpans2[j].segmentId = dbSpans2[k].segmentId;
}

console.log(dbSpans2);

export { dbSpans2 as dbSpans };
