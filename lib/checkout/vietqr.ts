export type VietQrOrderSnapshot = {
  bankBin: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  amount: number;
  paymentReference: string;
};

export function buildVietQrUrl(snapshot: VietQrOrderSnapshot) {
  if (!/^[0-9]{6}$/.test(snapshot.bankBin)) {
    throw new Error("Invalid bank BIN snapshot.");
  }
  if (!snapshot.bankAccountNumber.trim() || !snapshot.bankAccountHolder.trim() || !snapshot.paymentReference.trim()) {
    throw new Error("Incomplete Order payment snapshot.");
  }
  if (!Number.isSafeInteger(snapshot.amount) || snapshot.amount <= 0) {
    throw new Error("Invalid Order total.");
  }

  const bankId = encodeURIComponent(snapshot.bankBin);
  const accountNumber = encodeURIComponent(snapshot.bankAccountNumber);
  const url = new URL(`https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png`);
  url.searchParams.set("amount", String(snapshot.amount));
  url.searchParams.set("addInfo", snapshot.paymentReference);
  url.searchParams.set("accountName", snapshot.bankAccountHolder);
  return url.toString();
}

export function buildZaloUrl(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? `https://zalo.me/${digits}` : null;
}
