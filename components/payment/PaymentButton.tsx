"use client";

import { useState } from "react";
import { BankTransferModal } from "@/components/payment/BankTransferModal";
import type { PaymentProduct } from "@/data/payment";

export function PaymentButton({ product, children, className }: { product: PaymentProduct; children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return <>{isOpen ? <BankTransferModal product={product} onClose={() => setIsOpen(false)} /> : null}<button type="button" onClick={() => setIsOpen(true)} className={className}>{children}</button></>;
}
