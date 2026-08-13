"use client";

import Image from "next/image";
import { useState } from "react";
import { QrCode } from "lucide-react";

export function VietQrImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="status" className="grid aspect-square w-full place-items-center rounded-xl border border-amber-300/20 bg-amber-500/[0.06] p-6 text-center">
        <div><QrCode className="mx-auto h-10 w-10 text-amber-300" /><p className="mt-3 text-sm font-bold leading-6 text-amber-100">Không tải được mã QR. Vui lòng chuyển khoản theo thông tin bên dưới.</p></div>
      </div>
    );
  }

  return <Image src={src} alt="Mã VietQR của đơn hàng" width={520} height={520} priority unoptimized onError={() => setFailed(true)} className="aspect-square h-auto w-full rounded-xl bg-white object-contain" />;
}
