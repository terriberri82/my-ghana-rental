import prisma from "../lib/prisma.js";

export const createProperty = async (req, res) => {
  try {
    const { name, address, city, region, propertyType, description } = req.body;

    if (!name || !address || !city || !region || !propertyType) {
      return res.status(400).json({
        message: "Name, address, city, region and property type are required.",
      });
    }

    const property = await prisma.property.create({
      data: {
        name,
        address,
        city,
        region,
        propertyType,
        description: description || null,
        landlordId: req.userId,
      },
    });

    res.status(201).json({ property });
  } catch (error) {
    console.error("createProperty:", error);
    res.status(500).json({
      message: "Couldn't save the property. Please try again.",
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { landlordId: req.userId },
      include: {
        _count: { select: { units: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ properties });
  } catch (error) {
    console.error("getProperties:", error);
    res.status(500).json({ message: "Couldn't load your properties." });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await prisma.property.findFirst({
      where: { id: req.params.id, landlordId: req.userId },
      include: {
        units: { orderBy: { unitLabel: "asc" } },
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("getProperty:", error);
    res.status(500).json({ message: "Couldn't load the property." });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { name, address, city, region, propertyType, description } = req.body;

    const existing = await prisma.property.findFirst({
      where: { id: req.params.id, landlordId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Property not found." });
    }

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: { name, address, city, region, propertyType, description },
    });

    res.status(200).json({ property });
  } catch (error) {
    console.error("updateProperty:", error);
    res.status(500).json({ message: "Couldn't save the changes." });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await prisma.property.findFirst({
      where: { id: req.params.id, landlordId: req.userId },
      include: { _count: { select: { units: true } } },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (property._count.units > 0) {
      return res.status(409).json({
        message:
          "This property still has units. Remove the units first, then delete the property.",
      });
    }

    await prisma.property.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Property deleted." });
  } catch (error) {
    console.error("deleteProperty:", error);
    res.status(500).json({ message: "Couldn't delete the property." });
  }
};