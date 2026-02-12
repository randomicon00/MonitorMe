/* import type { NextApiRequest, NextApiResponse } from "next";
import { dbSpans } from "../../data/spans";
import { parseSpans } from "../../utils/common";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

/*import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${BASE_URL}/spans`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
          "Content-Type": "application/json",
        },
      } as any);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const { data: spans } = (await response.json()) ?? {};
      const numOfItems = spans.length;

      res.status(200).json({
        data: {
          spans,
          numOfItems,
        },
        message: "spans information",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    res.status(405).json({ error: "Method not supported" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
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
    const url = `${BASE_URL}/spans`;

    try {
      const { data: spans } = await fetchFromAPI(
        url,
        process.env.AUTHORIZATION_TOKEN
      );

      let numOfItems;
      if (typeof spans === "string") {
        // When spans is a string (e.g., "no spans found"), set numOfItems to 0
        numOfItems = 0;
      } else if (Array.isArray(spans)) {
        // When spans is an array, set numOfItems to the array's length
        numOfItems = spans.length;
      } else {
        // Unexpected case: Log the issue and set a default value
        console.error("Unexpected type of spans response:", spans);
        numOfItems = 0; // Default to 0 or throw an error if appropriate
      }

      res.status(200).json({
        data: {
          spans,
          numOfItems,
        },
        message: "spans information",
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}
