export function pkr(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "PKR 0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (abs >= 10000000) {
    const crore = abs / 10000000;
    return `${sign}PKR ${crore.toFixed(crore >= 10 ? 1 : 2)} Crore`;
  }
  if (abs >= 100000) {
    const lakh = abs / 100000;
    return `${sign}PKR ${lakh.toFixed(lakh >= 10 ? 1 : 2)} Lakh`;
  }
  return `${sign}PKR ${Math.round(abs).toLocaleString("en-US")}`;
}

export function formatArea(sqft: number, marlaStandard: number = 225): string {
  if (!Number.isFinite(sqft) || sqft <= 0) return "0 sqft";
  const marlas = sqft / marlaStandard;

  if (marlas >= 20) {
    const kanal = marlas / 20;
    const remainderMarla = marlas % 20;
    if (remainderMarla < 0.25) {
      return `${kanal.toFixed(kanal % 1 === 0 ? 0 : 1)} Kanal`;
    }
    return `${Math.floor(kanal)} Kanal ${remainderMarla.toFixed(1)} Marla`;
  }

  if (marlas >= 1) {
    return `${marlas.toFixed(marlas % 1 === 0 ? 0 : 1)} Marla`;
  }

  return `${Math.round(sqft).toLocaleString("en-US")} sqft`;
}
