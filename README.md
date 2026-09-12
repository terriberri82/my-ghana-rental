

# My Ghana Rental
myghanarental.netlify.app

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

How it is used here:

`BrowserRouter` wraps the app and watches the URL.

`Routes` and `Route` map each URL to the component that should render there.

`Link` moves between pages without a full reload, which is what keeps React
state alive during navigation. A plain anchor tag would reload the page and wipe
that state.

`Navigate` handles route protection. `AuthLayout` renders `<Navigate to="/login" replace />`
when a logged out user tries to reach the dashboard, and `UnauthLayout` sends a
logged in user away from the login and signup pages. Using the `Navigate`
component rather than calling `useNavigate` inside `useEffect` avoids an
infinite redirect loop.

`Outlet` is the slot inside a layout where the matched child route renders. The
layout stays mounted while only the inner page changes.

`useNavigate` redirects after an action rather than after a click. Submitting
the signup form sends the user to the dashboard programmatically, with
`replace: true` so the back button will not return them to the form.


## Getting Started

```bash
git clone https://github.com/terriberri82/my-ghana-rental.git
cd my-ghana-rental
npm install
npm run dev
```



# Data Model

My Ghana Rental uses PostgreSQL (hosted on Neon) with Prisma ORM. The schema has seven tables designed around how landlords in Ghana actually manage property, including advance rent payments and mobile money.

## Users

Stores both landlords and tenants, separated by a `role` enum.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| firstName | String | |
| lastName | String | Split from full name so names can be sorted and greetings personalised |
| email | String? | Optional and unique |
| phone | String | Required and unique, the real identifier |
| passwordHash | String? | Optional until the account is activated |
| role | Role | LANDLORD or TENANT |
| inviteToken | String? | Single-use token for tenant activation |
| createdAt | DateTime | |

**Why phone is the identifier.** Landlords add tenants by name and phone number. Many tenants have no email address, and phone numbers are how people are reached in Ghana.

**Why passwordHash is optional.** A tenant record exists as soon as the landlord creates it, before that person has ever logged in. The landlord shares an activation link over WhatsApp, and the tenant sets a password at that point.

## Properties

A building or plot owned by a landlord.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| landlordId | String | References Users |
| name | String | Landlord's own label, e.g. "Adjei House" |
| address | String | |
| city | String | |
| region | Region | Enum of the sixteen Ghanaian regions |
| propertyType | PropertyType | COMPOUND_HOUSE, APARTMENT_BLOCK, SINGLE_FAMILY, COMMERCIAL |
| description | String? | |
| createdAt | DateTime | |

**Why enums for region and propertyType.** They become dropdowns in the UI, which prevents inconsistent values like "Compound", "compound house" and "Compund" all meaning the same thing. Filtering stays reliable.

## Units

One rentable space inside a property. A single-family house has one unit; a compound house has one per room let.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| propertyId | String | References Properties |
| unitLabel | String | e.g. "Room 3", "Ground floor" |
| bedrooms | Int | |
| bathrooms | Int | |
| rentAmount | Decimal(12,2) | Asking price |
| rentPeriod | RentPeriod | MONTHLY, SIX_MONTHS or ANNUAL |
| status | UnitStatus | VACANT or OCCUPIED |
| createdAt | DateTime | |

**Why every property has units.** Treating a whole house as a single unit keeps one query path instead of two, so the code never branches on property type.

**Why status is stored.** Occupancy could be computed from active leases, but storing it is faster to read. It is set in the same operation that creates or ends a lease so it cannot drift.

## Leases

An agreement between one tenant and one unit for a fixed period.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| unitId | String | References Units |
| tenantId | String | References Users |
| startDate | DateTime | |
| endDate | DateTime | |
| rentAmount | Decimal(12,2) | Agreed price, may differ from the unit's asking price |
| rentPeriod | RentPeriod | |
| advanceMonths | Int | Months paid upfront |
| depositAmount | Decimal(12,2) | Security deposit |
| agreementUrl | String? | Uploaded lease document |
| status | LeaseStatus | ACTIVE, EXPIRED or TERMINATED |
| previousLeaseId | String? | Links a renewal to the lease it replaced |
| createdAt | DateTime | |

**Why advanceMonths exists.** Ghanaian tenants commonly pay one or two years of rent upfront. Storing the month count lets the app show a landlord when a tenant's coverage runs out rather than pretending rent arrives monthly.

**Why rentAmount is duplicated from Units.** The unit holds the current asking price. The lease holds what this tenant agreed to, and that must not change if the asking price is raised later.

**Why renewals create a new record.** Extending `endDate` would destroy the record of the old terms. A new lease with `previousLeaseId` set preserves the full history of what a tenant paid over time.

## Payments

A payment covers a period, not just an amount.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| leaseId | String | References Leases |
| tenantId | String | Who the payment is for |
| recordedById | String? | Set when a landlord logs a payment by hand |
| amount | Decimal(12,2) | |
| method | PaymentMethod | MOBILE_MONEY, CARD or CASH |
| paystackReference | String? | Null for manually recorded payments |
| status | PaymentStatus | PENDING, SUCCESS or FAILED |
| coversFrom | DateTime | Start of the period paid for |
| coversTo | DateTime | End of the period paid for |
| receiptNumber | String? | Human-readable, e.g. MGR-2026-0001 |
| paidAt | DateTime? | Set only on confirmation |
| createdAt | DateTime | |

**Why money uses Decimal, not Float.** Floating point arithmetic loses precision, which is unacceptable for rent.

**Why status and paidAt are separate.** Paystack reports a transaction as initiated first and confirms success later via webhook. A payment is created PENDING with no `paidAt`, and is only marked SUCCESS when the webhook confirms it server-side. Money is never treated as received before that.

**Why recordedById is nullable.** A Paystack payment has no human who entered it. When the field is filled, it identifies the landlord who logged a cash payment, which matters if a tenant later disputes it.

**Partial payments are not supported.** Allowing them would break the guarantee that `coversFrom` and `coversTo` describe a fully paid period.

## MaintenanceRequests

Issues raised by tenants against a unit.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| unitId | String | References Units |
| tenantId | String | References Users |
| title | String | |
| description | String | |
| priority | Priority | LOW, MEDIUM or HIGH |
| status | RequestStatus | OPEN, IN_PROGRESS or RESOLVED |
| imageUrls | String[] | Cloudinary links |
| createdAt | DateTime | |
| resolvedAt | DateTime? | |

**Why there is no comments table.** Conversation happens on WhatsApp, where these users already are. The maintenance page links straight through with a `wa.me` link built from the other party's phone number. The landlord moves the status through the workflow, which carries most of the value at a fraction of the build cost.

**Why images are URLs, not files.** Databases store references to images, not the images themselves. Files go to Cloudinary and the link is stored here.

## ConditionReports

Photographic record of a unit's state at the start and end of a tenancy.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| leaseId | String | References Leases |
| createdById | String | Landlord or tenant |
| type | ReportType | MOVE_IN or MOVE_OUT |
| notes | String? | |
| imageUrls | String[] | Cloudinary links |
| createdAt | DateTime | |

**Why either party can submit both types.** At move-in the tenant needs proof of pre-existing damage so they are not charged for it. At move-out the landlord needs proof of new damage. Both sides have an interest at both ends, so both can document, and reports are displayed side by side labelled with who submitted them.

**Why it is tied to the lease, not the unit.** The point is to prove the state of the place at the start and end of one specific tenancy.

**Rules enforced in the routes, not the schema:**
- MOVE_IN reports accepted within 7 days of `startDate`
- MOVE_OUT reports accepted within 7 days either side of `endDate`
- Reports cannot be edited once submitted, since their value depends on being a fixed record of a moment

## Relationships

```
User (landlord) ──< Property ──< Unit ──< Lease ──< Payment
                                    │        │
                                    │        └──< ConditionReport
                                    └──< MaintenanceRequest

User (tenant) ──< Lease
              ──< Payment
              ──< MaintenanceRequest
              ──< ConditionReport
```

Deletes cascade downward. Removing a property removes its units, and removing a unit removes its leases, so PostgreSQL handles the cleanup rather than application code.