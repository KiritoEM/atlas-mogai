import Image from "next/image";

export function MoramoraScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#191918]">
      <Image
        src="/illustrations/moramora-dashboard.png"
        alt=""
        fill
        sizes="224px"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgba(0,0,0,0.18)]" />
    </div>
  );
}
