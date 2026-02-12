import { localizeTime, tryParseJSON, getStr } from "./common";

export interface Span {
  spanId: string;
  sentAt: number;
  data: {
    "service.name": string;
    "db.system"?: string;
  };
  requestData: string;
  statusCode?: number;
  triggerRoute: string;
}

export interface GridSpan {
  id: string;
  dateCreated: string;
  serviceName: string;
  spanType: string;
  requestData: string;
  statusCode: number | null;
  triggerRoute: string;
}

// Extracts and structures relevant grid properties from a given 'span' object
const mapSpanToGrid = ({
  spanId,
  sentAt, //timeSent,
  data,
  requestData,
  statusCode,
  triggerRoute,
}: Span): GridSpan => {
  return {
    id: spanId,
    dateCreated: localizeTime(sentAt / 1000),
    serviceName: getStr(data["service.name"]) ?? "",
    spanType: data["db.system"] || "http",
    requestData: getStr(tryParseJSON(requestData)) ?? "",
    statusCode: statusCode || null,
    triggerRoute,
  };
};

export default mapSpanToGrid;
