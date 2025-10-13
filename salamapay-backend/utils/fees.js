// Simple fee engine based on the tariff table provided
function escrowFee(amount) {
  // 1% escrow fee as example (minimum 1)
  return Math.max(1, Math.round((amount * 1) / 100));
}

function withdrawalFee(amount) {
  const tiers = [
    [0,100,0],[101,500,5],[501,1000,10],[1001,1500,15],[1501,2500,20],
    [2501,3500,25],[3501,5000,34],[5001,7500,42],[7501,10000,48],
    [10001,15000,57],[15001,20000,62],[20001,25000,67],
    [25001,30000,72],[30001,35000,83],[35001,40000,99],
    [40001,45000,103],[45001,999999,108]
  ];
  for (const t of tiers) {
    if (amount >= t[0] && amount <= t[1]) return t[2];
  }
  return 108;
}

module.exports = { escrowFee, withdrawalFee };
