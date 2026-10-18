const DESCRIPTOR_HASH =
  "461f0e70d2935c415730c741c54e67da9bded09fbf8f6b40a1126212a1250144";
function validateCandidate(candidate) {
  const valid =
    candidate.vendorId === 0x258a &&
    candidate.productId === 0x0049 &&
    candidate.interface === 1 &&
    candidate.descriptorHash === DESCRIPTOR_HASH;
  return {
    valid,
    reason: valid
      ? "static-identity-match-not-hardware-verified"
      : "identity-mismatch",
  };
}
module.exports = { DESCRIPTOR_HASH, validateCandidate };
