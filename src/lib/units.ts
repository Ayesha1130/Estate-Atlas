// Pakistani Real Estate Unit System & Financial Calculators
export type MarlaStandard = "lda" | "bahria" | "revenue";

export const MARLA_STANDARDS: Record<MarlaStandard, { label: string; sqft: number; description: string }> = {
  lda: {
    label: "LDA / Lahore Standard (225 sqft)",
    sqft: 225,
    description: "Standard adopted by Lahore Development Authority (LDA) and most modern housing societies across Punjab.",
  },
  bahria: {
    label: "CDA / Bahria Standard (250 sqft)",
    sqft: 250,
    description: "Standard used in Islamabad CDA sectors, Bahria Town, and several northern development authorities.",
  },
  revenue: {
    label: "Board of Revenue / Patwar Standard (272.25 sqft)",
    sqft: 272.25,
    description: "Official government revenue record standard (9 square karams = 30.25 sq yards). Used for rural and agricultural land.",
  },
};

export const DEFAULT_MARLA_SQFT = 272.25; // Official standard default (225 used for modern LDA developments)

export const UNITS = {
  marla: 272.25, // legacy backward-compatible default
  kanal: 5445,
  sqft: 1,
  sqyd: 9, // 1 Guz = 1 sq yd = 9 sq ft
} as const;

export type Unit = keyof typeof UNITS;

/**
 * Convert any quantity to square feet based on specified Marla standard
 */
export function toSqft(value: number, unit: Unit | "acre" | "guz", marlaSqft: number = DEFAULT_MARLA_SQFT): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  switch (unit) {
    case "marla":
      return value * marlaSqft;
    case "kanal":
      return value * (marlaSqft * 20);
    case "sqyd":
    case "guz":
      return value * 9;
    case "acre":
      return value * (marlaSqft * 20 * 8); // 8 Kanals
    case "sqft":
    default:
      return value;
  }
}

/**
 * Convert square feet to all other units given a Marla standard
 */
export function fromSqft(sqft: number, marlaSqft: number = DEFAULT_MARLA_SQFT) {
  if (!Number.isFinite(sqft) || sqft <= 0) {
    return { sqft: 0, marla: 0, kanal: 0, sqyd: 0, acre: 0 };
  }
  const marla = sqft / marlaSqft;
  const kanal = marla / 20;
  const sqyd = sqft / 9;
  const acre = kanal / 8;
  return {
    sqft: Number(sqft.toFixed(2)),
    marla: Number(marla.toFixed(2)),
    kanal: Number(kanal.toFixed(3)),
    sqyd: Number(sqyd.toFixed(2)),
    acre: Number(acre.toFixed(3)),
  };
}

export const totalPrice = (value: number, unit: Unit, ratePerUnit: number) => value * ratePerUnit;

export const pricePerSqft = (value: number, unit: Unit, ratePerUnit: number, marlaSqft: number = DEFAULT_MARLA_SQFT) => {
  const sqft = toSqft(value, unit, marlaSqft);
  return sqft > 0 ? totalPrice(value, unit, ratePerUnit) / sqft : 0;
};

export interface ConstructionEstimate {
  areaSqft: number;
  coveredAreaPercent: number; // typically 70% for houses
  coveredAreaSqft: number;
  ratePerSqft: number;
  totalCost: number;
  breakdown: {
    structure: number; // grey structure (~60%)
    finishing: number; // luxury finishing (~40%)
  };
}

export function estimateConstructionCost(
  area: number,
  unit: Unit,
  quality: "economy" | "standard" | "luxury" | "premium" = "luxury",
  coveredPercent: number = 75,
  marlaSqft: number = DEFAULT_MARLA_SQFT
): ConstructionEstimate {
  const plotSqft = toSqft(area, unit, marlaSqft);
  const coveredAreaSqft = (plotSqft * coveredPercent) / 100;

  // 2026 Pakistani market benchmarks (PKR / sqft)
  const rates = {
    economy: 3500,
    standard: 4800,
    luxury: 7200,
    premium: 9800,
  };

  const ratePerSqft = rates[quality];
  const totalCost = coveredAreaSqft * ratePerSqft;

  return {
    areaSqft: Math.round(plotSqft),
    coveredAreaPercent: coveredPercent,
    coveredAreaSqft: Math.round(coveredAreaSqft),
    ratePerSqft,
    totalCost: Math.round(totalCost),
    breakdown: {
      structure: Math.round(totalCost * 0.55),
      finishing: Math.round(totalCost * 0.45),
    },
  };
}

export interface EmiDetails {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  yearlySchedule: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }[];
}

export function calculateEmi(
  propertyPrice: number,
  downPaymentPercent: number,
  annualInterestRate: number,
  tenureYears: number
): EmiDetails {
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(0, propertyPrice - downPaymentAmount);

  const monthlyRate = annualInterestRate / 1200;
  const totalMonths = tenureYears * 12;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = totalMonths > 0 ? loanAmount / totalMonths : 0;
  } else {
    monthlyEmi =
      totalMonths > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : 0;
  }

  const monthlyEmiRounded = Math.round(monthlyEmi);
  const totalPayment = monthlyEmiRounded * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // Calculate annual amortization
  const yearlySchedule: EmiDetails["yearlySchedule"] = [];
  let balance = loanAmount;

  for (let y = 1; y <= tenureYears; y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      const interestMonth = balance * monthlyRate;
      const principalMonth = monthlyEmi - interestMonth;
      yearInterest += interestMonth;
      yearPrincipal += principalMonth;
      balance = Math.max(0, balance - principalMonth);
    }

    yearlySchedule.push({
      year: y,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      balance: Math.round(balance),
    });
  }

  return {
    loanAmount: Math.round(loanAmount),
    downPaymentAmount: Math.round(downPaymentAmount),
    monthlyEmi: Math.round(monthlyEmi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    yearlySchedule,
  };
}
