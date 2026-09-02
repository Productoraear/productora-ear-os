import { exec } from "child_process";
import path from "path";

export const marketingEngine = {
  async launchHunter(domain: string) {
    const scriptPath = path.resolve("H:/EAR_OS_BACKUP_YOLO_PRE_RECONSTRUCCION/marketingskills-main/marketingskills-main/tools/clis/hunter.js");
    return new Promise((resolve, reject) => {
      exec(`node ${scriptPath} domain-search --domain ${domain}`, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(JSON.parse(stdout || "{}"));
      });
    });
  }
};