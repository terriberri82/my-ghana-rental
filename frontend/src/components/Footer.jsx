import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function FooterLink({ href, children, className }) {
  const Tag = "a";
  return (
    <Tag href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </Tag>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const linkClass = "text-sm text-paper/60 hover:text-paper transition-colors";

  return (
    <footer className="bg-bayou-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-14">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="" className="w-9 h-9" />
              <span className="font-display font-semibold text-paper">
                My Ghana Rental
              </span>
            </Link>
            <p className="mt-4 text-sm text-paper/60 leading-relaxed max-w-xs">
              Rent records that survive a lost phone. Built for landlords in
              Ghana, from compound houses to blocks of flats.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className={linkClass}>
                  Get started
                </Link>
              </li>
              <li>
                <Link to="/login" className={linkClass}>
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className={linkClass}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-paper/50">
            © {year} My Ghana Rental. Accra, Ghana.
          </p>
          <p className="text-xs text-paper/40">
            Photography by{" "}
            <FooterLink
              href="https://unsplash.com"
              className="text-paper/60 hover:text-paper"
            >
              Unsplash
            </FooterLink>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
