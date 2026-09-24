import { Link } from "react-router-dom";


const STEPS = [
  {
    key: "property",
    title: "Add your first property",
    description: "The house, compound or building you rent out.",
    to: "/properties/new",
    cta: "Add property",
  },
  {
    key: "unit",
    title: "Add your units",
    description: "Each room, flat or shop a tenant can rent.",
    to: "/units/new",
    cta: "Add unit",
  },
  {
    key: "tenant",
    title: "Add a tenant",
    description: "Set up their lease so you can start tracking rent.",
    to: "/leases/new",
    cta: "Add tenant",
  },
];
function SetupChecklist({
  dismissed,
  onDismiss,
  propertyCount,
  unitCount,
  leaseCount,
}) {
  const done = {
    property: propertyCount > 0,
    unit: unitCount > 0,
    tenant: leaseCount > 0,
  };

  const completedCount = Object.values(done).filter(Boolean).length;
  const currentIndex = STEPS.findIndex((step) => !done[step.key]);

  if (dismissed || completedCount === STEPS.length) return null;

  return (
    <section className="rounded-2xl border border-ebony/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ebony">
            Get your first rental set up
          </h2>
          <p className="mt-1 text-sm text-ebony/65">
            {completedCount} of {STEPS.length} done
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-sm text-ebony/60 hover:text-ebony hover:underline"
        >
          Skip for now
        </button>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-ebony/10">
        <div
          className="h-2 rounded-full bg-bayou transition-all"
          style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
        />
      </div>

      <ol className="mt-6 space-y-4">
        {STEPS.map((step, index) => {
          const isDone = done[step.key];
          const isCurrent = index === currentIndex;
          const isLocked = !isDone && !isCurrent;

          return (
            <li
              key={step.key}
              className={`flex items-center gap-4 rounded-xl p-4 ${
                isCurrent ? "bg-bayou/5 ring-1 ring-bayou/30" : ""
              } ${isLocked ? "opacity-50" : ""}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isDone ? "bg-bayou text-white" : "bg-ebony/10 text-ebony"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>

              <div className="flex-1">
                <p className={`font-medium text-ebony ${isDone ? "line-through" : ""}`}>
                  {step.title}
                </p>
                <p className="text-sm text-ebony/65">{step.description}</p>
              </div>

              {isCurrent && (
                <Link
                  to={step.to}
                  state={{ fromOnboarding: true }}
                  className="rounded-lg bg-bayou px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  {step.cta}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default SetupChecklist;