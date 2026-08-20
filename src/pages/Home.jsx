import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="bg-emerald-50 px-7=6 py-30 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rental property management software for landlords in Ghana
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Track properties, tenants, leases and rent payments in one place.
          Record rent paid by MTN MoMo, Telecel Cash, bank transfer or cash, and
          always know exactly who has paid and who hasn't.
        </p>
        <Link
          to="/signup"
          className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-blue-800"
        >
          Get Started
        </Link>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          Your tenants don't have to change a thing
        </h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
          No app for them to download. No new number to send money to. They pay
          you exactly the way they always have, you just record it here in a few
          taps instead of hunting through your SMS inbox at month end.
        </p>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          Everything a Ghanaian landlord needs to manage rentals
        </h2>
        <p className="text-gray-700 max-w-2xl text-center mx-auto mb-8">
          One place for your properties, your tenants and your money.
        </p>

        <div className="grid gap-6 md:grid-cols-4 max-w-5xl mx-auto">
          <div className="border rounded p-6">
            <h3 className="font-bold mb-2">
              Know what's occupied and what's empty
            </h3>
            <p className="text-sm text-gray-600">
              Every property and unit organised in one dashboard, so you spot a
              vacancy the day it happens instead of the month after.
            </p>
          </div>

          <div className="border rounded p-6">
            <h3 className="font-bold mb-2">
              Know who has paid, chase who hasn't
            </h3>
            <p className="text-sm text-gray-600">
              Log each payment in GHS against the right tenant and unit, and
              mark how it came in.
            </p>
          </div>

          <div className="border rounded p-6">
            <h3 className="font-bold mb-2">Stop losing repairs in WhatsApp</h3>
            <p className="text-sm text-gray-600">
              Tenants report a problem from their phone. You track every request
              from open to resolved, with a record of what was fixed and when.
            </p>
          </div>
          <div className="border rounded p-6">
            <h3 className="font-bold mb-2">Never miss a lease expiry again</h3>
            <p className="text-sm text-gray-600">
              Store every tenancy agreement with its start date, rent advance
              and expiry, so renewal never sneaks up on you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
