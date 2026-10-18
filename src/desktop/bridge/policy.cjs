function validateSender(event, origin) {
  if (
    !event.senderFrame ||
    event.senderFrame !== event.sender.mainFrame ||
    new URL(event.senderFrame.url).origin !== origin
  )
    throw new Error("forbidden");
}
function boundedPayload(payload) {
  if (
    payload !== undefined &&
    Buffer.byteLength(JSON.stringify(payload)) > 65536
  )
    throw new Error("invalid-profile");
}
async function dispatch(handlers, action, payload) {
  if (typeof action !== "string" || !Object.hasOwn(handlers, action))
    throw new Error("forbidden");
  boundedPayload(payload);
  return handlers[action](payload);
}
module.exports = { validateSender, dispatch };
