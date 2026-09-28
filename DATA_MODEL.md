# Data Model

My Ghana Rental uses PostgreSQL (hosted on Neon) with Prisma ORM. The schema has eight tables designed around how small landlords in Ghana actually manage property, including advance rent payments and mobile money.

MaintenanceRequests and ConditionReports exist in the schema but aren't part of the MVP. Maintenance requests are planned alongside the tenant portal after the capstone. Condition reports were cut.

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
| onboardingDismissed | Boolean | Hides the dashboard setup checklist once the landlord skips or finishes it |
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

## PropertyImages

Photos attached to a property.

| Field | Type | Notes |
|---|---|---|
| id | String | UUID primary key |
| propertyId | String | References Properties, indexed |
| url | String | Cloudinary link |
| publicId | String | Cloudinary ID, needed to delete the file |
| position | Int | Display order |
| createdAt | DateTime | |

**Why a separate table.** A property can have several photos, up to 10. A single image field on Properties would have needed reworking later, so this was built for many from the start.

**Why store publicId.** Deleting a row doesn't delete the file from Cloudinary. The publicId lets the app remove the file too.

**No photos uploaded.** The app shows a generic fallback image.

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
| coversFrom | DateTime? | Start of the period paid for |
| coversTo | DateTime? | End of the period paid for |
| receiptNumber | String? | Human-readable, e.g. MGR-2026-0001 |
| note | String? | Optional landlord note, e.g. for a manually recorded payment |
| paidAt | DateTime? | Set only on confirmation |
| createdAt | DateTime | |

**Why money uses Decimal, not Float.** Floating point arithmetic loses precision, which is unacceptable for rent.

**Why status and paidAt are separate.** Paystack reports a transaction as initiated first and confirms success later via webhook. A payment is created PENDING with no `paidAt`, and is only marked SUCCESS when the webhook confirms it server-side. Money is never treated as received before that.

**Three ways a payment is created.** The landlord records money already received, the landlord sends a Paystack payment link over WhatsApp, or (once the tenant portal exists) the tenant pays from the portal. Landlords never pay on a tenant's behalf.

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

Photographic record of a unit's state at the start and end of a tenancy. Cut from the app; the table remains in the schema.

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
                   Property ──< PropertyImage
User (landlord) ──< Property ──< Unit ──< Lease ──< Payment
                                    │        │
                                    │        └──< ConditionReport
                                    └──< MaintenanceRequest

User (tenant) ──< Lease
              ──< Payment
              ──< MaintenanceRequest
              ──< ConditionReport
```

Deletes currently cascade downward in the schema. Removing a property removes its units and images, and removing a unit removes its leases.

The app adds guards on top of that. A property can't be deleted while it still has units, and a tenant can't be deleted once they have payment records. Ending a lease early keeps the lease and its payment history. After the MVP, the Property and Unit relations will switch from Cascade to Restrict so the database enforces this too.
