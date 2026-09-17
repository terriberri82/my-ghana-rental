import prisma from "../lib/prisma.js";

const ownsProperty = async (propertyId, userId) => {
  return prisma.property.findFirst({
    where: { id: propertyId, landlordId: userId },
  });
};

export const createUnit = async (req, res) => {
  try {
    const { propertyId, unitLabel, bedrooms, bathrooms, rentAmount, rentPeriod } =
      req.body;

    if (!propertyId || !unitLabel || rentAmount === undefined) {
      return res.status(400).json({
        message: "Property, unit label and rent amount are required.",
      });
    }

    if (Number(rentAmount) <= 0) {
      return res.status(400).json({
        message: "The rent has to be more than zero.",
      });
    }

    const property = await ownsProperty(propertyId, req.userId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const unit = await prisma.unit.create({
      data: {
        propertyId,
        unitLabel,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        rentAmount,
        rentPeriod: rentPeriod || "MONTHLY",
      },
    });

    res.status(201).json({ unit });
  } catch (error) {
    console.error("createUnit:", error);
    res.status(500).json({
      message: "Couldn't save the unit. Please try again.",
    });
  }
};

export const getUnits = async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      where: { property: { landlordId: req.userId } },
      include: {
        property: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ units });
  } catch (error) {
    console.error("getUnits:", error);
    res.status(500).json({ message: "Couldn't load your units." });
  }
};

export const getUnit = async (req, res) => {
  try {
    const unit = await prisma.unit.findFirst({
      where: { id: req.params.id, property: { landlordId: req.userId } },
      include: {
        property: {
          select: { id: true, name: true, address: true, city: true },
        },
        leases: {
          orderBy: { startDate: "desc" },
          include: {
            tenant: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
            payments: {
              orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
              select: {
                id: true,
                amount: true,
                method: true,
                status: true,
                paidAt: true,
                note: true,
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    res.status(200).json({ unit });
  } catch (error) {
    console.error("getUnit:", error);
    res.status(500).json({ message: "Couldn't load the unit." });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const { unitLabel, bedrooms, bathrooms, rentAmount, rentPeriod, status } =
      req.body;

    if (rentAmount !== undefined && Number(rentAmount) <= 0) {
      return res.status(400).json({
        message: "The rent has to be more than zero.",
      });
    }

    const existing = await prisma.unit.findFirst({
      where: { id: req.params.id, property: { landlordId: req.userId } },
    });

    if (!existing) {
      return res.status(404).json({ message: "Unit not found." });
    }

    const unit = await prisma.unit.update({
      where: { id: req.params.id },
      data: {
        unitLabel,
        bedrooms: bedrooms !== undefined ? Number(bedrooms) : undefined,
        bathrooms: bathrooms !== undefined ? Number(bathrooms) : undefined,
        rentAmount,
        rentPeriod,
        status,
      },
    });

    res.status(200).json({ unit });
  } catch (error) {
    console.error("updateUnit:", error);
    res.status(500).json({ message: "Couldn't save the changes." });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const unit = await prisma.unit.findFirst({
      where: { id: req.params.id, property: { landlordId: req.userId } },
      include: { _count: { select: { leases: true } } },
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    if (unit._count.leases > 0) {
      return res.status(409).json({
        message:
          "This unit has lease records attached. Remove the lease first, then delete the unit.",
      });
    }

    await prisma.unit.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Unit deleted." });
  } catch (error) {
    console.error("deleteUnit:", error);
    res.status(500).json({ message: "Couldn't delete the unit." });
  }
};