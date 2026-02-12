import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { fetchFromAPI, handleError } from "utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const url = `${BASE_URL}/spans/segment/${id}`;

    try {
      const { data } = await fetchFromAPI(url, process.env.AUTHORIZATION_TOKEN);
      res.status(200).json({
        data,
        message: `spans by segment id {${id}} returned!`,
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}

/*import { NextApiRequest, NextApiResponse } from "next";
import { dbSpans } from "../../../data/spans";
import { parseSpans } from "../../../utils/common";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { query } = req;

    // TODO: Replace with golang service call
    const spans = dbSpans;
    // end golang service call

    const spansBySegment = parseSpans(
      spans.filter((span) => span.segmentId === query.id)
    );

    res.json({
      data: spansBySegment,
      message: `spans by segment ${query.id} information`,
    });
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
  } else {
    res.status(405).json("");
  }
}*/
