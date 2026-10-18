import { createServer } from "vite";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const server = await createServer();
await server.listen();
const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
const env = { ...process.env, LANTRYX_DEV_ORIGIN: origin };
delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(require("electron"), ["."], { stdio: "inherit", env });
let closing = false;
async function close(code = 0) {
  if (closing) return;
  closing = true;
  child.kill();
  await server.close();
  process.exit(code);
}
child.once("exit", (code) => close(code ?? 1));
child.once("error", (error) => {
  console.error(error.message);
  close(1);
});
process.once("SIGINT", () => close());
process.once("SIGTERM", () => close());
console.log(`LAntryx offline: ${origin}`);
