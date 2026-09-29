# My Ghana Rental

**Live site:** https://myghanarental.netlify.app

A property management web app for small landlords in Ghana.

Individual capstone project, Women Techsters Sprint 2026.

---

## What This Project Is

Most small landlords in Ghana manage properties informally. Rent records live in
WhatsApp threads, paper receipts and memory. Leases are printed once and filed
away.

The result: landlords have no single view of who has paid, no record trail when
a payment is disputed, and no reliable way to manage property remotely, for
example from abroad on behalf of family.

Existing property platforms are built for large agencies, priced accordingly,
and assume a US style monthly rent cycle paid by card. They do not fit a
landlord with three units in Accra whose tenants pay by MoMo, bank transfer or
cash, often months in advance.

My Ghana Rental gives landlords one organised place to manage properties, units,
tenants, leases and rent payments. Tenants don't need an account or an app.
They pay the way they always have, and the landlord records it in a few taps.

**Who it is for.** Small landlords with roughly 1 to 20 units, often a family
property, sometimes managed remotely, and almost always from a phone.

## What It Does

- **Accounts:** sign up and log in with phone number or email and a password.
  Sessions use a JWT stored in an httpOnly cookie.
- **Guided setup:** a dashboard checklist walks new landlords through adding a
  property, a unit and a tenant, with the option to skip.
- **Properties and units:** add buildings with up to 10 photos each, then the
  units inside them. Vacant units are flagged on the dashboard.
- **Tenants and leases:** assign a tenant to a unit with rent, start and end
  dates, deposit and months paid in advance. Upload the signed lease or take a
  photo of it on a phone. Tenant details can be edited, and ending a lease early
  keeps its full payment history.
- **Payments:** record rent received by mobile money, cash or card and bank
  transfer, then send the tenant a prefilled WhatsApp receipt.
- **Dashboard:** units occupied and vacant, total recorded this month, a six
  month payments chart, recent payments and vacant units.
- **Profile:** edit account details and upload a profile photo.
- **Contact form:** messages are delivered by email through Resend.
- **Mobile friendly:** the whole app works on phones and tablets, with a top
  bar and tab navigation on small screens.

## Scope Decisions

These were cut from the capstone build on purpose so the core record keeping
could ship properly. Most already have tables or columns in the schema.

| Not in this version                     | Why                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tenant portal (tenant logins)           | Needs invite tokens, activation and role based routing. Planned next                                                     |
| Maintenance requests                    | Only useful once tenants can log in to report issues. The `MaintenanceRequest` table is ready                            |
| Online payments (Paystack)              | Only makes sense once tenants can pay from the portal. `paystackReference` and `PaymentStatus` are already in the schema |
| Rent status labels (paid, due, overdue) | Needs a firm rule for how advance months and payment coverage dates interact. Planned next                               |
| Condition reports                       | Lower priority than the portal. The `ConditionReport` table is ready                                                     |
| Applications, vendors, listings         | Separate products. Landlords onboard tenants they already have                                                           |

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router DOM, lucide-react,
deployed on Netlify.

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL on Neon, JWT auth with
httpOnly cookies, bcrypt, deployed on Render.

**Services:** Cloudinary for property photos, lease documents and profile
photos. Resend for contact form email. WhatsApp `wa.me` links for receipts and
messaging tenants.

## Deployment Note

The frontend (Netlify) and backend (Render) live on different domains. iPhone
Safari blocks cookies from a different site, so the login cookie was being
dropped on iPhones. The fix is a Netlify proxy in `frontend/public/_redirects`:
the browser calls `/api/...` on the Netlify domain and Netlify forwards it to
Render, so the cookie stays first-party.

## Getting Started

This is a monorepo with a `frontend/` and a `backend/` folder.

```bash
git clone https://github.com/terriberri82/my-ghana-rental.git
cd my-ghana-rental
```

**Backend**

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Create `backend/.env`:

```
DATABASE_URL=         # Neon or local PostgreSQL connection string
JWT_SECRET=           # any long random string
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
RESEND_API_KEY=       # for the contact form
CONTACT_TO_EMAIL=     # where contact form messages are sent
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

`VITE_` variables are readable in the browser, so they never hold secrets.

## Other Docs

- [`PRD.md`](PRD.md): product requirements
- [`DATA_MODEL.md`](DATA_MODEL.md): the database schema, with the reasoning behind each table
