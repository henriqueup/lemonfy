// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse<Buffer>) {
  const filePath = path.resolve("./pages/api", "assets/MIAAAAAAAU.mp3");
  const audioBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "audio/mpeg");
  res.send(audioBuffer);
}
