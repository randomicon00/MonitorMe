import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { fetchFromAPI, handleError } from "utils/api";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { id } = req.query;
        const url = `${BASE_URL}/events/session/${id}`;

        try {
            const { data } = await fetchFromAPI(url, process.env.AUTHORIZATION_TOKEN);
            console.log("data from session:", data);
            res.status(200).json({
                data,
                message: `events by session ${id} information`,
            });
        } catch (err: any) {
            handleError(res, err);
        }
    } else {
        res.status(405).json({ error: "Method not supported" });
    }
}
