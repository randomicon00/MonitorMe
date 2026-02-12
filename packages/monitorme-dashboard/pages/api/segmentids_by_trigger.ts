import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { fetchFromAPI, handleError } from "utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { trigger_route } = req.query;
    if (!trigger_route || typeof trigger_route !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing trigger_route parameter" });
    }

    // spans/session_id
    const url = `${BASE_URL}/segment?trigger_route=${trigger_route}`;

    try {
      const { data: spans } = await fetchFromAPI(
        url,
        process.env.AUTHORIZATION_TOKEN
      );
      const numOfItems = spans.length;

      res.status(200).json({
        data: {
          spans,
          numOfItems,
        },
        message: "segmentids information for trigger route ${trigger_route}",
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}
