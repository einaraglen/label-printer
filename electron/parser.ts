import fs from "fs";
import { parse } from "fast-csv";

export class Parser {
  public static csv(filepath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filepath);
      const lines: any[] = [];
      stream
        .pipe(parse({ headers: true }))
        .on("data", (line) => lines.push(line))
        .on("error", (err) => reject(err))
        .on("end", () => resolve(lines));
    });
  }

  public static xml(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.toString());
      });
    });
  }
}
