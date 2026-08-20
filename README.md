

# My Ghana Rental

A property management web app for landlords and tenants in Ghana.

Individual capstone project, Women's Techsters Sprint 2026.

---

## What This Project Is

Most small landlords in Ghana manage properties informally. Rent records live in
WhatsApp threads, paper receipts and memory. Leases are printed once and filed
away. Repairs get reported by phone call and forgotten.

The result: landlords have no single view of who has paid and who is behind, no
record trail when a payment is disputed, and no reliable way to manage property
remotely, for example from abroad on behalf of family. Tenants have no proof of
what they paid, no visibility into their own lease, and no way to follow up on a
reported fault.

Existing property platforms are built for large agencies, priced accordingly,
and assume a US style monthly rent cycle. They do not fit a landlord with three
units in Accra.

My Ghana Rental gives landlords one organised place to manage properties,
tenants, leases, rent payments and maintenance requests, and gives tenants their
own login to view their lease, see their payment history and report problems.
It is built mobile first, because most users will open it on a phone.

The design also fits how rent actually works here. Rather than assuming a fixed
monthly cycle, a lease stores a total amount and a period covered, and payments
are recorded against that lease. Advance rent arrangements work as naturally as
monthly ones.

**Who it is for.** The primary user is the small landlord with one to ten units,
often a family property, sometimes managed remotely. Not a buyer of enterprise
software, but with a real tracking problem today. The secondary user is the
tenant, who wants a clear record of payments, clarity on lease terms, and
repairs that do not get ignored.

## How the App Operates

1. A landlord signs up and creates an account
2. The landlord adds a property, for example an apartment block
3. The landlord adds units within it, each with a rent amount
4. The landlord assigns a tenant to a unit and records the lease terms, being
   the start date, end date, total amount and payment schedule
5. When a tenant pays, the landlord records the payment against that lease with
   the amount, date, period covered and method used, being mobile money, cash or
   bank transfer
6. The landlord dashboard shows at a glance which tenants are current and which
   are behind
7. A tenant logs in and sees their own lease details and full payment history
8. The tenant submits a maintenance request describing a problem in their unit
9. The landlord sees the request and moves it from open to in progress to
   resolved
10. The landlord can message a tenant directly on WhatsApp using a prefilled
    message link

Landlord and tenant read from the same underlying records, so both always see
the same truth. Every screen in the app is a view over six core entities: users,
properties, units, leases, payments and maintenance requests.

## Minimum Viable Product

The MVP covers accounts, properties, units, tenants, leases, payments and
maintenance requests. Nothing else.

**Screens:** Home, Sign Up, Login, About, Contact, Landlord Dashboard, Property
Detail, Unit and Lease Detail, Maintenance List, Tenant Home.

**Deliberately excluded, and why**

| Excluded | Reason |
|---|---|
| Online payment integration | Mobile money merchant approval sits outside the project timeline. Payments are recorded manually with the method noted, which still delivers the record keeping value |
| Applications and screening | An entire second product flow. Landlords onboard tenants they already have |
| Vendors, inspections, expense reports | Valuable, but not why a user opens the app |
| Rental search and listings | Depends on agent cooperation and listing supply the project cannot control |
| WhatsApp Business API | Needs business verification. Replaced with wa.me prefilled links, which work on any phone with no integration |

Later phases add expense tracking and financial reporting, tenant applications
and screening, vendor management, and eventually payment integration.

## Tech Stack

React, Vite, Tailwind CSS, React Router DOM, JavaScript ES6+, Git and GitHub.

A backend and database will be added later in the Sprint. Until then the app
runs on mock data shaped like the real entities, so connecting an API later
means changing where data comes from rather than rewriting components.

## About React Router DOM

React builds single page applications. Everything renders inside one HTML file,
with no built in concept of separate pages or URLs. React Router DOM adds that,
letting the app show different components based on the URL without the browser
ever reloading the page.

This project needs it because it has many distinct views, and each needs its own
address so users can bookmark pages, use the back button and share links.


## Getting Started

```bash
git clone https://github.com/terriberri82/my-ghana-rental.git
cd my-ghana-rental
npm install
npm run dev
```