import Link from "next/link";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["900"],
  // weight: ["400", "700", "800", "900"],
});

export default function NavLogoHome() {
  return (
    <div>
      <Link
        href={"/"}
        className={`${orbitron.className} text-xl font-[900]  text-[var(--brand)]`}
      >
        <span className="border-l-3 border-t-3 border-b-3 border-[var(--brand)] px-2 py-1">
          TO
        </span>
        <span className="border-l-3 border-t-3 border-b-3 border-[var(--brand)] px-2 py-1">
          FAB
        </span>
        <span className="border-3 border-[var(--brand)] px-2 py-1">ZA</span>
      </Link>
    </div>
  );
}
