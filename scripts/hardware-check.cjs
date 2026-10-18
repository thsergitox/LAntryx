const { encodeLiveRgb } = require("../src/lighting/protocol/live-rgb.cjs");
async function main(args = process.argv.slice(2)) {
  if (!args.length || (args.length === 1 && args[0] === "--dry-run")) {
    const frame = encodeLiveRgb({ r: 255, g: 0, b: 0 });
    console.log(
      JSON.stringify(
        {
          mode: "dry-run",
          hardwareAccess: false,
          reportBytes: frame.length,
          header: [...frame.subarray(0, 4)],
          note: "Static candidate only; no device was inspected, opened or written.",
        },
        null,
        2,
      ),
    );
    return;
  }
  if (args.length !== 1 || !["--inspect", "--probe"].includes(args[0]))
    throw new Error(
      "Use --dry-run, --inspect or --probe; raw packets and paths are not accepted.",
    );
  const {
    inspectLinuxCandidates,
  } = require("../src/device/detection/linux.cjs");
  const { validateCandidate } = require("../src/device/detection/identity.cjs");
  const candidates = await inspectLinuxCandidates();
  console.log(
    JSON.stringify(
      candidates.map((candidate) => ({
        ...candidate,
        ...validateCandidate(candidate),
      })),
      null,
      2,
    ),
  );
  if (args[0] === "--inspect") return;
  if (!process.stdin.isTTY || !process.stdout.isTTY)
    throw new Error("The probe requires the owner at an interactive terminal.");
  if (
    candidates.filter((candidate) => validateCandidate(candidate).valid)
      .length !== 1
  )
    throw new Error("Exactly one matching interface/descriptor is required.");
  const { createInterface } = require("node:readline/promises");
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let color;
  try {
    console.log(
      "EXPERIMENTAL: one volatile RGB candidate frame. Initialization, effect and persistence are unknown. No permission changes or profile-write commands are requested. Stop after an unexpected result.",
    );
    const hex = await terminal.question("RGB color, exactly #RRGGBB: ");
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error("Invalid color.");
    const phrase = `EXPERIMENT MK825-TRIX ${hex.toUpperCase()}`;
    const answer = await terminal.question(
      `Confirm physical model and uncertainty. Type ${phrase}: `,
    );
    if (answer !== phrase) throw new Error("Cancelled.");
    color = {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  } finally {
    terminal.close();
  }
  const { runWorker } = require("../src/device/transport/worker-client.cjs");
  const result = await runWorker({ action: "live-rgb", color });
  console.log(JSON.stringify(result, null, 2));
  if (result.outcome !== "transport-accepted") process.exitCode = 1;
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { main };
