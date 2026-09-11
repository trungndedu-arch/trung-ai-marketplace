import Image from "next/image";

export function VietQrImage() {
  return (
    <Image
      src="/images/payment-vib-fixed-qr.png"
      alt="Mã VietQR cố định của tài khoản VIB Nguyễn Đức Trung"
      width={1284}
      height={1798}
      priority
      sizes="(max-width: 640px) calc(100vw - 72px), 360px"
      className="h-auto w-full rounded-xl bg-white object-contain"
    />
  );
}
