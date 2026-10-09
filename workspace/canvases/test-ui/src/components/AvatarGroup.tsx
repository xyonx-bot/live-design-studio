import { cn } from "../lib/utils";

type AvatarSpec = { bg: string; hair: string };

const AVATARS: AvatarSpec[] = [
  { bg: "#8fb3f9", hair: "#3b6fd4" }, // blue
  { bg: "#f7a8c4", hair: "#c2557f" }, // pink
  { bg: "#f5a971", hair: "#c06f35" }, // orange
];

function Face({ bg, hair }: AvatarSpec) {
  return (
    <svg viewBox="0 0 44 44" className="h-full w-full" aria-hidden>
      <circle cx="22" cy="22" r="22" fill={bg} />
      <path
        d="M5 17c1.5-9 8.5-14.5 17-14.5S37.5 8 39 17c-5-3.4-10.2-5-17-5s-12 1.6-17 5z"
        fill={hair}
      />
      <circle cx="15.5" cy="23" r="2" fill="#1f2937" />
      <circle cx="28.5" cy="23" r="2" fill="#1f2937" />
      <path
        d="M15.5 29.5c1.9 2.4 4 3.5 6.5 3.5s4.6-1.1 6.5-3.5"
        stroke="#1f2937"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Three overlapping cartoon avatars used for the hero social-proof row. */
export function AvatarGroup({ className }: { className?: string }) {
  return (
    <div className={cn("flex -space-x-2.5", className)}>
      {AVATARS.map((a) => (
        <span
          key={a.bg}
          className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
        >
          <Face {...a} />
        </span>
      ))}
    </div>
  );
}

export default AvatarGroup;
