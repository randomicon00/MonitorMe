import type { NextApiRequest, NextApiResponse } from "next";
import { BASE_URL } from "utils/constants";
import { handleError } from "utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { oldPassword, newPassword, notes } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new passwords are required" });
    }

    if (oldPassword !== process.env.PASSWORD) {
      return res
        .status(400)
        .json({ error: "The current password is incorrect" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        error: "The new password cannot be the same as the current password",
      });
    }

    const url = `${BASE_URL}/change-password`;

    try {
      const body = JSON.stringify({ oldPassword, newPassword, notes });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to submit password change request"
        );
      }

      const data = await response.json();
      res.status(200).json({
        data,
        message:
          "Password change request submitted successfully. Pending owner approval.",
      });
    } catch (err: any) {
      handleError(res, err);
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}
