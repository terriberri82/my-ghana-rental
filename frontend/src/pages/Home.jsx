import { Link } from "react-router-dom";
import {
  Building2,
  Wallet,
  KeyRound,
  FileCheck,
  CalendarClock,
} from "lucide-react";
import HeroVisual from "../components/HeroVisual";

const pillButton =
  "inline-flex items-center justify-center rounded-full bg-sun text-ebony font-medium text-sm px-7 py-3 hover:brightness-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bayou";

const features = [
  {
    icon: Building2,
    title: "Properties and units",
    text: "Every building and every unit in one dashboard, so you spot a vacancy the day it happens instead of the month after.",
  },
  {
    icon: Wallet,
    title: "Rent payments",
    text: "Log each payment in cedis against the right tenant and unit, and mark whether it came by MoMo, transfer or cash.",
  },
  {
    icon: KeyRound,
    title: "Tenants and leases",
    text: "Record who is living where, the agreed rent and the advance months, without your tenants needing an account.",
  },
  {
    icon: FileCheck,
    title: "A record that holds up",
    text: "Every payment dated and attached to a lease, so the history is there when a tenant says they already paid.",
  },
];

const steps = [
  {
    title: "Add your property",
    text: "Enter the building and its units. Photos are optional.",
  },
  {
    title: "Add tenants and leases",
    text: "Who lives where, the monthly rent and how many months were paid upfront.",
  },
  {
    title: "Record rent as it comes in",
    text: "MoMo, Telecel Cash, bank or cash. Every payment is saved to that tenant's history.",
  },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-paper overflow-hidden">
        <div className="grid lg:grid-cols-12 items-center max-w-7xl mx-auto lg:min-h-[min(calc(100vh-100px),800px)]">
          <div className="lg:col-span-5 px-6 lg:pl-14 lg:pr-6 pt-10 pb-10 md:pt-14 lg:py-12 text-center lg:text-left">
            <h1>
              <span className="block text-xs sm:text-sm font-medium text-bayou/70 tracking-wide mb-3 md:mb-4">
                Property management for landlords in Ghana
              </span>
              <span className="block font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-bayou leading-[1.15]">
                Your property.
                <br />
                Your records.
              </span>
            </h1>
            <p className="mt-4 md:mt-5 text-sm sm:text-base text-ebony/70 leading-relaxed max-w-md mx-auto lg:mx-0">
              Track properties, tenants, leases and rent payments in one place.
              Record rent paid by MTN MoMo, Telecel Cash, bank transfer or cash,
              and keep a clear record of every payment.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/signup" className={pillButton}>
                Start tracking rent
              </Link>
            </div>
            <p className="mt-5 md:mt-6 text-xs sm:text-sm text-ebony/60">
              MTN MoMo · Telecel Cash · Bank transfer · Cash
            </p>
          </div>

          <div className="lg:col-span-7 px-6 lg:pl-0 lg:pr-14 pb-14 lg:py-2">
            <div className="max-w-lg mx-auto lg:max-w-none">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-bayou">
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-paper text-balance">
              Everything a Ghanaian landlord needs
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-paper/70 leading-relaxed">
              One place for your properties, your tenants and your money.
            </p>
          </div>

          <div className="mt-10 md:mt-12 grid md:grid-cols-2 gap-4 md:gap-5">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-5 md:p-6 flex gap-4">
                <span className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-sun flex items-center justify-center">
                  <Icon size={20} strokeWidth={2} className="text-bayou" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-bayou">{title}</h3>
                  <p className="mt-2 text-sm text-ebony/65 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}

            {/* Advance rent: the Ghana-specific feature, full width */}
            <div className="md:col-span-2 bg-white rounded-2xl p-5 md:p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-sun flex items-center justify-center">
                <CalendarClock size={20} strokeWidth={2} className="text-bayou" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-semibold text-bayou">
                  Advance rent, tracked properly
                </h3>
                <p className="mt-2 text-sm text-ebony/65 leading-relaxed max-w-2xl">
                  Tenants in Ghana often pay months upfront. Record the advance
                  on each lease so you always know what period has been paid
                  for, instead of working it out from old receipts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-2xl md:text-4xl font-semibold text-bayou text-center text-balance">
          How it works
        </h2>
        <ol className="mt-10 md:mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sun font-display font-bold md:text-lg text-bayou flex items-center justify-center">
                {i + 1}
              </span>
              <h3 className="mt-3 md:mt-4 font-display font-semibold text-bayou">{step.title}</h3>
              <p className="mt-2 text-sm text-ebony/65 leading-relaxed max-w-xs">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tenants don't change anything */}
      <section className="border-t border-pearl/60">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-bayou leading-tight text-balance">
            Your tenants don't have to change a thing
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-ebony/70 leading-relaxed">
            No app for them to download. No new number to send money to. They pay
            you exactly the way they always have, you just record it here in a few
            taps instead of hunting through your SMS inbox at month end.
          </p>
          <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-bayou">
            <span className="px-4 py-2 rounded-full bg-pearl/40">Tenant pays as usual</span>
            <span aria-hidden="true" className="text-sun">→</span>
            <span className="px-4 py-2 rounded-full bg-pearl/40">You record it</span>
            <span aria-hidden="true" className="text-sun">→</span>
            <span className="px-4 py-2 rounded-full bg-pearl/40">History saved</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-pearl/50">
        <div className="max-w-4xl mx-auto px-6 py-14 md:py-20 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left gap-8 md:gap-10">
          <div>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-bayou max-w-md leading-tight text-balance">
              Your first property takes two minutes
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-ebony/65">
              Free to start. No card, no setup call.
            </p>
          </div>
          <Link to="/signup" className={`${pillButton} shrink-0`}>
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;