import prisma from "../lib/prisma.js";

const ownedUnit = (userId) => ({ property: { landlordId: userId } });

export const createLease = async (req, res) => {
  try {
    const {
      unitId,
      firstName,
      lastName,
      phone,
      startDate,
      endDate,
      rentAmount,
      advanceMonths,
      depositAmount,
    } = req.body;

    if (!unitId || !firstName || !lastName || !phone || !startDate || !endDate) {
      return res.status(400).json({
        message:
          "Unit, tenant name, phone number, start date and end date are required.",
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "The lease end date has to be after the start date.",
      });
    }

    const unit = await prisma.unit.findFirst({
      where: { id: unitId, ...ownedUnit(req.userId) },
      include: { leases: { where: { status: "ACTIVE" }, select: { id: true } } },
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    if (unit.leases.length > 0) {
      return res.status(409).json({
        message:
          "This unit already has an active tenant. End the current lease before adding a new one.",
      });
    }

    let tenant = await prisma.user.findUnique({ where: { phone } });

    if (tenant && tenant.role === "LANDLORD") {
      return res.status(409).json({
        message: "That phone number belongs to a landlord account.",
      });
    }

    const lease = await prisma.$transaction(async (tx) => {
      if (!tenant) {
        tenant = await tx.user.create({
          data: { firstName, lastName, phone, role: "TENANT" },
        });
      }

      const created = await tx.lease.create({
        data: {
          unitId,
          tenantId: tenant.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount: rentAmount || unit.rentAmount,
          advanceMonths: Number(advanceMonths) || 0,
          depositAmount: depositAmount || 0,
        },
      });

      await tx.unit.update({
        where: { id: unitId },
        data: { status: "OCCUPIED" },
      });

      return created;
    });

    res.status(201).json({ lease });
  } catch (error) {
    console.error("createLease:", error);
    res.status(500).json({
      message: "Couldn't add the tenant. Please try again.",
    });
  }
};

export const getLease = async (req, res) => {
  try {
    const lease = await prisma.lease.findFirst({
      where: { id: req.params.id, unit: ownedUnit(req.userId) },
      include: {
        tenant: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        unit: {
          select: {
            id: true,
            unitLabel: true,
            property: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!lease) {
      return res.status(404).json({ message: "Lease not found." });
    }

    res.status(200).json({ lease });
  } catch (error) {
    console.error("getLease:", error);
    res.status(500).json({ message: "Couldn't load the lease." });
  }
};

export const getActiveLeases = async (req, res) => {
  try {
    const leases = await prisma.lease.findMany({
      where: { status: "ACTIVE", unit: ownedUnit(req.userId) },
      orderBy: { unit: { unitLabel: "asc" } },
      select: {
        id: true,
        rentAmount: true,
        tenant: { select: { firstName: true, lastName: true } },
        unit: {
          select: {
            id: true,
            unitLabel: true,
            property: { select: { name: true } },
          },
        },
      },
    });

    res.status(200).json({ leases });
  } catch (error) {
    console.error("getActiveLeases:", error);
    res.status(500).json({ message: "Couldn't load your tenants." });
  }
};

export const endLease = async (req, res) => {
  try {
    const lease = await prisma.lease.findFirst({
      where: { id: req.params.id, unit: ownedUnit(req.userId) },
    });

    if (!lease) {
      return res.status(404).json({ message: "Lease not found." });
    }

    await prisma.$transaction([
      prisma.lease.update({
        where: { id: lease.id },
        data: { status: "TERMINATED" },
      }),
      prisma.unit.update({
        where: { id: lease.unitId },
        data: { status: "VACANT" },
      }),
    ]);

    res.status(200).json({ message: "Lease ended." });
  } catch (error) {
    console.error("endLease:", error);
    res.status(500).json({ message: "Couldn't end the lease." });
  }
};