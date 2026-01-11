let monthlySpend = 0;
const MONTHLY_CAP = 50; // $50

export function checkBudget() {
  if (monthlySpend >= MONTHLY_CAP) {
    throw new Error('Monthly budget exceeded');
  }
}

export function addSpend(estimatedCost) {
  monthlySpend += estimatedCost;
}

export function getMonthlySpend() {
  return monthlySpend;
}

export function resetMonthlySpend() {
  monthlySpend = 0;
}
