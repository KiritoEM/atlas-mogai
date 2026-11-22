import Image from "next/image";

export function GaspikaScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-white">
      <Image
        src="/illustrations/gaspika-onboarding.png"
        alt=""
        fill
        sizes="224px"
        className="object-cover [object-position:center_20%]"
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgba(0,0,0,0.05)]" />
    </div>
  );
}
