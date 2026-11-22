import Image from "next/image";

export function AizaScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#f8f6f1]">
      <Image
        src="/illustrations/aiza-city.jpg"
        alt=""
        fill
        sizes="224px"
        className="object-cover object-top"
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgba(0,0,0,0.06)]" />
    </div>
  );
}
