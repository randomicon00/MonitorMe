/*import type { NextApiRequest, NextApiResponse } from "next";
import { URL } from "utils/constants";

import { dbSpans } from "../../data/spans";
import { parseSpans } from "../../utils/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const numOfItems = dbSpans.length;

    // API Call to get Spans (not done yet)
    // const spans = fetch(some_url/spans);

    // Do we still need this parse? Short answer is no.
    const parsedSpans = parseSpans(dbSpans);

    res.status(200).json({
      data: {
        spans: parsedSpans,
        numOfItems,
      },
      message: "spans information",
    });
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
  } else {
    res.status(405).json("");
  }
}*/

import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { fetchFromAPI, handleError } from "utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${BASE_URL}/events/snapshots`;

    try {
      const { data: snapshots } = await fetchFromAPI(
        url,
        process.env.AUTHORIZATION_TOKEN
      );
      const numOfItems = snapshots.length;

      res.status(200).json({
        data: {
          snapshots,
          numOfItems,
        },
        message: "snapshots information",
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
    res.status(405).json({ error: "Method not supported" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
