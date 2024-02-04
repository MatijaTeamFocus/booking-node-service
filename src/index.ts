import "reflect-metadata";

import { AppDataSource } from "./data-source";
import { WebServer } from "./WebServer";
import { sleep } from "./utils/helpers.util";

let webServer: WebServer | undefined;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log(
      "🤖⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️ | Server connected to the database"
    );

    webServer = new WebServer(3000);
    webServer.listen();
  } catch (error) {
    console.log(
      "🤖⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️ | Service crashed -> restarting ............",
      { error }
    );
    if (webServer) {
      await webServer.shutdown();
    }
    await sleep(5000);
    await main();
  }
}

main().catch((error: any) => {
  console.error(
    "🤖⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️ | Server crashed",
    error
  );
});
