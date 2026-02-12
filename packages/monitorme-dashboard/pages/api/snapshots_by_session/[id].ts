import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { fetchFromAPI, handleError } from "utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const url = `${BASE_URL}/snapshots/session/${id}`;

    try {
      const { data } = await fetchFromAPI(url, process.env.AUTHORIZATION_TOKEN);
      res.status(200).json({
        data,
        message: `snapshots by session id {${id}} returned!`,
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}

/*
import { NextApiRequest, NextApiResponse } from "next";
import { dbSnapshots } from "../../../data/snapshots";
import { parseSpans } from "../../../utils/common";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { query } = req;

    // TODO: Replace with golang service call
    const snapshots = dbSnapshots;

    const snapshotsBySession = parseSpans(
      snapshots.filter((snapshot: any) => snapshot.sessionId === query.id)
    );
    // end of the dbcall

    res.json({
      data: snapshotsBySession,
      message: `snapshots by session id{${query.id}} returned!`,
    });
  } else if (req.method === "POST") {
    console.log("Not supported yet!");
  } else {
    res.status(405).json("");
  }
}
*/
