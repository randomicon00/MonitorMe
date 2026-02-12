/*import { NextApiRequest, NextApiResponse } from "next";

import { dbEvents } from "../../../data/data";
import { parseEvents } from "../../../utils/common";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    // TODO: Replace with golang service call
    // golang service call (replace)
    const golangServiceCall = (id: any) => {
      const events = dbEvents;
      const parsedEvents = parseEvents(events);
      return parsedEvents.find((event) => event.data.timestamp === id);
    };
    const event = golangServiceCall(id);
    // end golang service call

    if (event) {
      res.status(200).json({ data: event, message: `event ${id} information` });
    } else {
      res.status(404).json({ message: `event ${id} not found` });
    }
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
  } else {
    // 405 is Method Not Allowed
    res.status(405).json("");
  }
}*/

import { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id: eventId } = req.query; // Assuming the event ID is provided in the query
    const url = `${BASE_URL}/events/${eventId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
          "Content-Type": "application/json",
        },
      } as any);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      const { data: event } = (await response.json()) ?? {};

      res.status(200).json({
        data: event,
        message: "Event information",
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message || "Internal Server Error",
      });
    }
  } else if (req.method === "POST") {
    res.status(405).json({ error: "Method not supported" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
