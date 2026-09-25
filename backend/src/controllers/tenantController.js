import prisma from "../lib/prisma.js";

// A landlord may only touch a tenant who has a lease in one of their units.
const isMyTenant = async (tenantId, userId) => {
  const lease = await prisma.lease.findFirst({
    where: {
      tenantId,
      unit: { property: { landlordId: userId } },
    },
    select: { id: true },
  });

  return Boolean(lease);
};

export const updateTenant = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const tenantId = req.params.id;

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        message: "First name, last name and phone number are required.",
      });
    }

    const tenant = await prisma.user.findFirst({
      where: { id: tenantId, role: "TENANT" },
    });

    if (!tenant || !(await isMyTenant(tenantId, req.userId))) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const cleanPhone = phone.replace(/\s/g, "");

    if (cleanPhone !== tenant.phone) {
      const taken = await prisma.user.findUnique({
        where: { phone: cleanPhone },
      });

      if (taken) {
        return res.status(409).json({
          message: "That number is already registered to another account.",
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id: tenantId },
      data: { firstName, lastName, phone: cleanPhone },
      select: { id: true, firstName: true, lastName: true, phone: true },
    });

    res.status(200).json({ tenant: updated });
  } catch (error) {
    console.error("updateTenant:", error);
    res.status(500).json({ message: "Couldn't save the changes." });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;

    const tenant = await prisma.user.findFirst({
      where: { id: tenantId, role: "TENANT" },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    // Every lease this tenant has, so we can tell ours from another landlord's.
    const leases = await prisma.lease.findMany({
      where: { tenantId },
      select: {
        id: true,
        unit: { select: { property: { select: { landlordId: true } } } },
        _count: { select: { payments: true } },
      },
    });

    const myLeases = leases.filter(
      (l) => l.unit.property.landlordId === req.userId,
    );

    if (myLeases.length === 0) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const paymentCount = myLeases.reduce(
      (sum, l) => sum + l._count.payments,
      0,
    );

    if (paymentCount > 0) {
      return res.status(409).json({
        message:
          "This tenant has payment records. End their lease instead, so the history stays on file.",
      });
    }

    const myLeaseIds = myLeases.map((l) => l.id);
    const isOnlyLandlord = myLeases.length === leases.length;

    await prisma.$transaction(async (tx) => {
      const activeLeases = await tx.lease.findMany({
        where: { id: { in: myLeaseIds }, status: "ACTIVE" },
        select: { unitId: true },
      });

      await tx.unit.updateMany({
        where: { id: { in: activeLeases.map((l) => l.unitId) } },
        data: { status: "VACANT" },
      });

      await tx.lease.deleteMany({ where: { id: { in: myLeaseIds } } });

      // Only remove the person's record if nobody else is renting to them.
      if (isOnlyLandlord) {
        await tx.user.delete({ where: { id: tenantId } });
      }
    });

    res.status(200).json({ message: "Tenant removed." });
  } catch (error) {
    console.error("deleteTenant:", error);
    res.status(500).json({ message: "Couldn't remove the tenant." });
  }
};
