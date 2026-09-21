import { Building2, Fence, House, Store } from "lucide-react";

const ICONS = {
  APARTMENT_BLOCK: Building2,
  SINGLE_FAMILY: House,
  COMMERCIAL: Store,
};

// Two houses with a fence running across the front and past both sides:
// several homes inside one walled compound.
function CompoundIcon() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <House className="h-12 w-12" strokeWidth={1.25} />
        <House className="h-12 w-12 -ml-1" strokeWidth={1.25} />
      </div>
      <div className="flex -mt-5">
        {[0, 1, 2, 3].map((i) => (
          <Fence
            key={i}
            className={`h-8 w-8 ${i > 0 ? "-ml-1" : ""}`}
            strokeWidth={1.25}
          />
        ))}
      </div>
    </div>
  );
}

export default function PropertyPlaceholder({ type, className = "" }) {
  const Icon = ICONS[type] || House;

  return (
    <div
      className={`flex items-center justify-center bg-paper text-bayou/40 ${className}`}
      aria-hidden="true"
    >
      {type === "COMPOUND_HOUSE" ? (
        <CompoundIcon />
      ) : (
        <Icon className="h-1/3 w-1/3" strokeWidth={1.25} />
      )}
    </div>
  );
}