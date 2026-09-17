import prisma from "../lib/prisma.js";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const getDashboard = async (req, res) => {
  try {
    const landlordId = req.userId;

    const ownedUnit = { property: { landlordId } };
    const ownedPayment = {
      status: "SUCCESS",
      lease: { unit: { property: { landlordId } } },
    };

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      propertyCount,
      unitCount,
      occupiedCount,
      payments,
      recent,
      vacant,
    ] = await Promise.all([
      prisma.property.count({ where: { landlordId } }),

      prisma.unit.count({ where: ownedUnit }),

      prisma.unit.count({ where: { ...ownedUnit, status: "OCCUPIED" } }),

      prisma.payment.findMany({
        where: { ...ownedPayment, paidAt: { gte: sixMonthsAgo } },
        select: { amount: true, paidAt: true },
      }),

      prisma.payment.findMany({
        where: { ...ownedPayment, paidAt: { not: null } },
        orderBy: { paidAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          method: true,
          paidAt: true,
          lease: {
            select: {
              unit: { select: { unitLabel: true } },
              tenant: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),

      prisma.unit.findMany({
        where: { ...ownedUnit, status: "VACANT" },
        take: 8,
        select: {
          id: true,
          unitLabel: true,
          rentAmount: true,
          property: { select: { name: true } },
        },
      }),
    ]);

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        label: MONTH_LABELS[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        total: 0,
        count: 0,
      });
    }

    for (const p of payments) {
      if (!p.paidAt) continue;
      const bucket = months.find(
        (m) =>
          m.month === p.paidAt.getMonth() && m.year === p.paidAt.getFullYear()
      );
      if (bucket) {
        bucket.total += Number(p.amount);
        bucket.count += 1;
      }
    }

    const thisMonth = months[months.length - 1];

    res.status(200).json({
      propertyCount,
      unitCount,
      occupiedCount,
      vacantCount: unitCount - occupiedCount,
      monthTotal: thisMonth.total,
      monthCount: thisMonth.count,
      months: months.map((m) => ({ label: m.label, total: m.total })),
      recentPayments: recent.map((p) => ({
        id: p.id,
        unitLabel: p.lease.unit.unitLabel,
        tenantName: `${p.lease.tenant.firstName} ${p.lease.tenant.lastName}`,
        method:
          p.method === "MOBILE_MONEY"
            ? "MoMo"
            : p.method === "CARD"
            ? "Card"
            : "Cash",
        date: p.paidAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        amount: p.amount,
      })),
      vacantUnits: vacant.map((u) => ({
        id: u.id,
        unitLabel: u.unitLabel,
        propertyName: u.property.name,
        rentAmount: u.rentAmount,
      })),
    });
  } catch (error) {
    console.error("getDashboard:", error);
    res.status(500).json({
      message: "Couldn't load your dashboard. Please try again.",
    });
  }
};