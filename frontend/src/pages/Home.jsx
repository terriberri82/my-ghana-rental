import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import HeroSlideshow from "../components/HeroSlideshow";

function Home() {
  return (
    <div>
      <section className="relative bg-paper overflow-hidden">
        <div className="grid md:grid-cols-2 items-center max-w-7xl mx-auto">
          <div className="px-6 md:pl-14 md:pr-10 pt-16 pb-12 md:py-24">
            <p className="text-ebony/50 text-xs tracking-wide mb-4">
              My Ghana Rental
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-bayou leading-[1.15]">
              Your property.
              <br />
              Your records.
            </h1>
            <p className="mt-5 text-ebony/70 leading-relaxed max-w-md">
              Track properties, tenants, leases and rent payments in one place.
              Record rent paid by MTN MoMo, Telecel Cash, bank transfer or cash,
              and always know who has paid.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button variant="gold" className="rounded-full px-7">
                  Start tracking rent
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] md:min-h-[620px]">
            <div className="absolute -top-16 -right-24 w-[560px] h-[560px] rounded-full bg-sun" />
            <div className="absolute inset-y-8 left-6 right-0 md:inset-y-12">
              <HeroSlideshow />
            </div>
          </div>
        </div>

        <div className="relative bg-pearl/50">
          <div className="max-w-7xl mx-auto px-6 md:pl-14 py-8">
            <div className="grid grid-cols-3 gap-6 max-w-md text-center md:text-left">
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-bayou">
                  4
                </p>
                <p className="mt-1 text-xs text-ebony/60">
                  Ways to record rent
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-bayou">
                  16
                </p>
                <p className="mt-1 text-xs text-ebony/60">Regions covered</p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-bold text-bayou">
                  2 min
                </p>
                <p className="mt-1 text-xs text-ebony/60">To your first unit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bayou">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper">
              Everything a Ghanaian landlord needs
            </h2>
            <p className="mt-4 text-paper/70 leading-relaxed">
              One place for your properties, your tenants and your money.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-sm p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-sun" />
              <div>
                <h3 className="font-display font-semibold text-bayou">
                  Properties and units
                </h3>
                <p className="mt-2 text-sm text-ebony/65 leading-relaxed">
                  Every building and every unit in one dashboard, so you spot a
                  vacancy the day it happens instead of the month after.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-sun" />
              <div>
                <h3 className="font-display font-semibold text-bayou">
                  Rent payments
                </h3>
                <p className="mt-2 text-sm text-ebony/65 leading-relaxed">
                  Log each payment in cedis against the right tenant and unit,
                  and mark whether it came by MoMo, transfer or cash.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-sun" />
              <div>
                <h3 className="font-display font-semibold text-bayou">
                  Tenants and leases
                </h3>
                <p className="mt-2 text-sm text-ebony/65 leading-relaxed">
                  Record who is living where, the agreed rent and the advance
                  months, without your tenants needing an account.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-sun" />
              <div>
                <h3 className="font-display font-semibold text-bayou">
                  A record that holds up
                </h3>
                <p className="mt-2 text-sm text-ebony/65 leading-relaxed">
                  Every payment dated and attached to a lease, so the history is
                  there when a tenant says they already paid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-bayou leading-tight">
          Your tenants don't have to change a thing
        </h2>
        <p className="mt-6 text-lg text-ebony/70 leading-relaxed">
          No app for them to download. No new number to send money to. They pay
          you exactly the way they always have, you just record it here in a few
          taps instead of hunting through your SMS inbox at month end.
        </p>
      </section>

      <section className="bg-pearl/50">
        <div className="max-w-6xl mx-auto px-6 py-20 md:flex md:items-center md:justify-between gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-bayou max-w-md leading-tight">
              Your first property takes two minutes
            </h2>
            <p className="mt-4 text-ebony/65">
              Free to start. No card, no setup call.
            </p>
          </div>
          <Link to="/signup" className="inline-block mt-8 md:mt-0 shrink-0">
            <Button variant="gold" className="rounded-full px-7">
              Create your account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
