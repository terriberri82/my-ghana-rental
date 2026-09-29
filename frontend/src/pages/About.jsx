import { Link } from "react-router-dom";

function About() {
  return (
    <div className="md:grid md:grid-cols-[40%_60%]">
      <div className="relative h-56 sm:h-64 md:h-auto">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bayou/40" />
      </div>

      <div className="px-6 md:px-16 pt-10 md:pt-32 pb-14 md:pb-20">
        <div className="max-w-xl">
          <p className="text-ebony/50 text-xs mb-3 md:mb-4">About</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-bayou leading-[1.15] text-balance">
            Built for the way Ghanaian landlords actually work
          </h1>

          <p className="mt-6 md:mt-8 text-sm sm:text-base text-ebony/70 leading-relaxed">
            Most rental software assumes a landlord with a leasing office, a
            portal for tenants and rent arriving by card on the first of the
            month. That is not how it works here. Rent comes by MoMo, by
            transfer, sometimes in cash at the gate. Records live in a receipt
            book, a WhatsApp thread, or in someone's head.
          </p>

          <p className="mt-4 md:mt-5 text-sm sm:text-base text-ebony/70 leading-relaxed">
            My Ghana Rental was built around that reality instead of against it.
            Your tenants don't sign up for anything. Nothing about how they pay
            you has to change. You just get a record that survives a lost phone
            and settles an argument about who paid what in March.
          </p>

          <h2 className="font-display text-xl md:text-2xl font-semibold text-bayou mt-10 md:mt-14">
            What it does
          </h2>

          <div className="mt-5 md:mt-6 space-y-5 md:space-y-6">
            <div className="border-l-2 border-sun pl-5">
              <h3 className="font-display font-semibold text-bayou">
                Properties and units
              </h3>
              <p className="mt-1.5 text-sm text-ebony/65 leading-relaxed">
                Every building and every unit in one place, whether that's a
                compound house in Dansoman or a block of flats in Osu.
              </p>
            </div>

            <div className="border-l-2 border-sun pl-5">
              <h3 className="font-display font-semibold text-bayou">
                Tenants and leases
              </h3>
              <p className="mt-1.5 text-sm text-ebony/65 leading-relaxed">
                Who lives where, the agreed rent, and how many months of advance
                they paid.
              </p>
            </div>

            <div className="border-l-2 border-sun pl-5">
              <h3 className="font-display font-semibold text-bayou">
                Payment history
              </h3>
              <p className="mt-1.5 text-sm text-ebony/65 leading-relaxed">
                Each payment dated, attached to a lease, and marked with how it
                came in.
              </p>
            </div>
          </div>

          <Link
            to="/signup"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-sun text-ebony font-medium text-sm px-7 py-3 hover:brightness-95 transition"
          >
            Start tracking rent
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;