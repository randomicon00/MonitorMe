import { fetchApiData } from "./common";
import { API_BY_SEGMENT_URL } from "./constants";

export async function getSpansAndEventsBySegmentId(
  segmentId: string | string[] | undefined
) {
  if (!segmentId || Array.isArray(segmentId)) {
    throw new Error("Invalid segmentId");
  }

  const [{ data: spans }, { data: events }] = await Promise.all(
    API_BY_SEGMENT_URL.map((url) => fetchApiData(url, segmentId))
  );

  return [spans, events];
}
