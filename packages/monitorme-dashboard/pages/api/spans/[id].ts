import { NextApiRequest, NextApiResponse } from "next";

/*import { dbSpans } from "../../../data/spans";

const parseSpanData = (data: string) => {
  const decodedData = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(decodedData);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    console.log("Query id is: ", id);

    // TODO: Replace with golang service call
    // golang service call (replace)
    const golangServiceCall = (id: any) => {
      const spans = dbSpans;
      const result = spans.find((span) => {
        return span.spanId === id;
      });
      return result;
    };
    const span = golangServiceCall(id);
    // end golang service call

    if (span) {
      span.data = parseSpanData(span.data);
      res.status(200).json({ data: span, message: `span ${id} information` });
    } else {
      res.status(404).json({ message: `span ${id} not found` });
    }
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
  } else {
    // Method Not Allowed
    res.status(405).json("");
  }
}*/

import { BASE_URL } from "utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id: spanId } = req.query; // Assuming the span ID is provided in the query
    const url = `${BASE_URL}/spans/${spanId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
          "Content-Type": "application/json",
        },
      } as any);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch span: ${response.statusText}`);
      }

      const { data: span } = (await response.json()) ?? {};

      res.status(200).json({
        data: span,
        message: "Span information",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    res.status(405).json({ error: "Method not supported" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
