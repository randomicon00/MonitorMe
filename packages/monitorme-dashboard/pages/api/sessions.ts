import type { NextApiRequest, NextApiResponse } from "next";

import { sessionColumnNames, /*sessions*/ allEvents } from "../../data/data";

const perPage = 10;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const numOfItems = sessions.length;
  const numOfItems = allEvents.length;

  //const page = req.query.page || 1;
  const page = req.query.page ? Number(req.query.page) : 1;

  // here goes the golang service
  //const rows = sessions.slice((page - 1) * perPage, page * perPage);
  const rows = allEvents.slice((page - 1) * perPage, page * perPage);
  // end of golang service

  res.status(200).json({
    columns: sessionColumnNames,
    rows,
    numOfItems: numOfItems,
  });
}
