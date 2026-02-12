/*import type { NextApiRequest, NextApiResponse } from "next";

import { triggerRoutes } from "../../data/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const numOfItems = triggerRoutes.length;

    // golang service
    const data = triggerRoutes;
    // end of golang service

    res.status(200).json({
      data: {
        triggerRoutes: data,
        numOfItems,
      },
      message: `trigger routes information`,
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
    const url = `${BASE_URL}/trigger-routes`;

    try {
      const { data: triggerRoutes } = await fetchFromAPI(
        url,
        process.env.AUTHORIZATION_TOKEN
      );

      let numOfItems;
      if (typeof triggerRoutes === "string") {
        // When triggerRoutes is a string (e.g., "no trigger routes found"), set numOfItems to 0
        numOfItems = 0;
      } else if (Array.isArray(triggerRoutes)) {
        // When triggerRoutes is an array, set numOfItems to the array's length
        numOfItems = triggerRoutes.length;
      } else {
        // Unexpected case: Log the issue and set a default value
        console.error(
          "Unexpected type of triggerRoutes response:",
          triggerRoutes
        );
        numOfItems = 0; // Default to 0 or throw an error if appropriate
      }

      res.status(200).json({
        data: {
          triggerRoutes,
          numOfItems,
        },
        message: "trigger routes information",
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}
