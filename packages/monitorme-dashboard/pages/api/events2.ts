export const config = {
  api: {
    responseLimit: false,
  },
};

/*import type { NextApiRequest, NextApiResponse } from "next";

import { dbEvents } from "../../data/data";
import { parseEvents } from "../../utils/common";

// const perPage = 10;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const numOfItems = dbEvents.length;

    // TODO: remove this const page = Number(req.query.page) || 1;
    // TODO: write the new version that uses the right format of data
    const parsedEvents = parseEvents(dbEvents);
    console.log(parsedEvents);

    res.status(200).json({
      data: {
        events: parsedEvents,
        numOfItems,
      },
    });
  } else if (req.method === "POST") {
  } else {
    res.status(405).json("");
  }
}*/

/*
import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${BASE_URL}/events`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const { data: events } = await response.json();
      const numOfItems = events.length;

      res.status(200).json({
        data: {
          events,
          numOfItems,
        },
        message: "events information",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
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
    const url = `${BASE_URL}/events`;

    try {
      const { data: events } = await fetchFromAPI(
        url,
        process.env.AUTHORIZATION_TOKEN
      );

      let numOfItems;

      if (typeof events === "string") {
        // When events is a string (e.g., "no events found"), set numOfItems to 0
        numOfItems = 0;
      } else if (Array.isArray(events)) {
        // When events is an array, set numOfItems to the array's length
        numOfItems = events.length;
      } else {
        // Unexpected case: Log the issue and set a default value
        console.error("Unexpected type of events response:", events);
        numOfItems = 0; // Default to 0 or throw an error if appropriate
      }

      res.status(200).json({
        data: {
          events,
          numOfItems,
        },
        message: "events information",
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
