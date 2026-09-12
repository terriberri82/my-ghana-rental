# My Ghana Rental - Product Requirements Document

Version 1.0 (MVP)
Owner: Terri
Repo: terriberri82/my-ghana-rental

---

## 1. The Problem

Small landlords in Ghana track rent through WhatsApp threads, paper receipts and memory. There is no single reliable record of who has paid, how much advance rent has been collected, or which units are vacant.

This matters because advance rent means money arrives in a lump sum and is often spent long before the months it covers have been used. Landlords lose track of what they still owe the tenant in occupancy, and disputes come down to whoever kept better notes.

**Outcome we want:** a landlord opens the app and sees every unit, who is in it, and when they last paid.

---

## 2. The User

**Primary and only user in v1:** the landlord.

- Owns roughly 1 to 20 units, often spread across two or three properties
- Uses a phone far more than a laptop, so mobile layout is the default, not an afterthought
- Collects rent mainly by mobile money
- Communicates with tenants over WhatsApp

**Tenants** exist as records the landlord creates. They do not log in. This is deliberate: a tenant portal would double the auth work and the surface area for no MVP benefit.

---

## 3. The MVP

### Must have

- Landlord signup and login (phone number and password)
- Create, view and edit properties
- Create, view and edit units under a property
- Create a tenant record and a lease linking that tenant to a unit, including rent amount and advance months
- Record a payment against a lease (amount, date, method, optional note)
- Edit or delete a payment record
- Dashboard showing all units with occupancy status and last payment date

### Not in the MVP

| Feature | Why deferred |
|---|---|
| Automatic balance calculation | Advance rent logic is the hard part; ship the record first |
| Tenant portal | Doubles auth work |
| Maintenance requests | Nice to have, not core to rent tracking |
| Condition reports | Cut entirely |
| Lease renewals | v2 |
| SMS notifications | Out of scope |
| Paystack live mode | Test mode only in MVP |
| Unit photos (Cloudinary) | Only if time allows |

### Known consequence of cutting calculation

The dashboard cannot show an amount owed. It shows occupied or vacant, and the date of the last payment. The landlord reads the payment history to work out where a tenant stands. This is an accepted trade-off for v1.

---

## 4. User Flows

### First run (empty account)

Open app → Sign up → Empty dashboard with Add Property card → Add first property → Add units to that property → Add tenant and create lease on a unit → Unit shows as occupied on dashboard

Each step is blocked by the one before it. There is no unit without a property and no lease without a unit. The empty dashboard must point at the next action.

### Recurring use

Open app → Log in → Dashboard → Tap a unit → See lease and payment history → Record payment → History updates → Optionally send a WhatsApp receipt via wa.me link

This is the flow the landlord does dozens of times a month. Target is three taps from opening the app to recording a payment.

---

## 5. Screens

| Screen | Purpose |
|---|---|
| Signup | Phone, password, name |
| Login | Phone, password |
| Dashboard | Home. All units across all properties. Unit name, property name, tenant name if occupied, last payment date |
| Properties list | All properties, tappable |
| Property detail | Property info, its units, add unit button |
| Unit detail | Unit info, current lease, payment history, record payment button |
| Forms | Add and edit for property, unit, tenant, lease, payment |

### Connections

Dashboard is home. From the dashboard you go sideways to Properties or straight down into a Unit detail. Unit detail is where the recurring work happens. Properties and units are setup you do once.

### Empty states

When the landlord has no properties, the dashboard shows an **Add Property card** as the call to action rather than a blank screen or an empty list.

---

## 6. Technical Requirements

### Frontend
- React with Vite
- Tailwind CSS (Vite plugin)
- React Router DOM v6
- Component state and props only. No global state manager.
- Deployed on Netlify, base directory `frontend`

### Backend
- Express
- Prisma 6 (Prisma 7 is incompatible with the schema-first approach)
- PostgreSQL hosted on Neon
- `backend/src/library/prisma.js` for the Prisma client

### Data model
Seven models: User, Property, Unit, Lease, Payment, MaintenanceRequest, ConditionReport. The last two exist in the schema but are not used in the MVP. All money fields are Decimal. Region and PropertyType are enums. Documented in `DATA_MODEL.md`.

### Auth
- Phone number is the primary identifier
- Password hashed, JWT for sessions
- Email and password are optional on User to support the landlord-creates-tenant flow with invite token activation later
- All queries filtered by the authenticated landlord server-side. React components are never the authorization layer.

### Payments
- Paystack in test mode
- Frontend never handles card data
- Server-side verification and webhooks, not browser-side confirmation

### Other
- WhatsApp via `wa.me` deep links. No WhatsApp Business API.
- Cloudinary for images if unit photos ship. Database stores references only.
- `VITE_` prefixed environment variables are bundled into the browser and never contain secrets

### Boundaries for AI-assisted building
No new libraries without a stated reason. No switching the ORM. No adding a state manager. No introducing TypeScript mid-project.

---

## 7. Edge Cases

### Deletion
- Deleting a property that still has units is **blocked**. Show a message telling the landlord to remove the units first.
- Deleting a unit that has a lease is **blocked** for the same reason.
- No cascade deletes. Cascading silently destroys payment records.

### Leases
- A unit that already has an active lease cannot be leased again. The create lease form must not offer occupied units.

### Payments
- Payments can be edited or deleted so a wrong amount or wrong lease can be corrected.

### Forms
- On a failed submit the form keeps its values. It does not clear.
- The submit button disables while a request is in flight so a double tap cannot create two records.

### Auth errors
Shown as a **modal**, not inline text:
- Login with a phone number that has no account
- Signup with a phone number that already exists
- Wrong password

### Empty data
- No properties: Add Property card on the dashboard
- Property with no units: prompt to add a unit
- Unit with no lease: shows as vacant with an option to create a lease
- Lease with no payments: empty payment history with a record payment button

---

## 8. Definition of Done

The MVP is finished when a landlord can:

1. Sign up with a phone number and log in
2. Create a property
3. Add units to that property
4. Create a tenant and a lease on a unit
5. Record several payments against that lease
6. Edit or delete a payment that was entered wrong
7. See the unit as occupied on the dashboard with the last payment date
8. Log out, log back in, and find all of it still there
9. Attempt to delete a property with units and be blocked with a clear message

Everything beyond this list is polish or v2.

---

## Framework used

Problem → User → MVP → Flow → Screens → Tech → Edge cases → Done
