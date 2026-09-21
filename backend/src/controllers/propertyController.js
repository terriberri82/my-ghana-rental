import { Region, PropertyType } from "@prisma/client";
import prisma from "../lib/prisma.js";

const MAX_IMAGES = 10;
const VALID_REGIONS = Object.values(Region);
const VALID_PROPERTY_TYPES = Object.values(PropertyType);

// Checks the images list sent from the frontend.
// Returns an error message, or null if everything is fine.
const validateImages = (images) => {
  if (!Array.isArray(images)) {
    return "Images must be a list.";
  }

  if (images.length > MAX_IMAGES) {
    return `You can add up to ${MAX_IMAGES} photos per property.`;
  }

  const allValid = images.every(
    (img) =>
      img &&
      typeof img.url === "string" &&
      img.url.trim() !== "" &&
      typeof img.publicId === "string" &&
      img.publicId.trim() !== "",
  );

  if (!allValid) {
    return "Each photo needs a url and a publicId.";
  }

  return null;
};

// Checks region and property type against the Prisma enums.
// Only checks a field if it was sent, so updates can leave them out.
const validateEnums = ({ region, propertyType }) => {
  if (region !== undefined && !VALID_REGIONS.includes(region)) {
    return "Please choose a valid region.";
  }

  if (
    propertyType !== undefined &&
    !VALID_PROPERTY_TYPES.includes(propertyType)
  ) {
    return "Please choose a valid property type.";
  }

  return null;
};

export const createProperty = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      region,
      propertyType,
      description,
      images = [],
    } = req.body;

    if (!name || !address || !city || !region || !propertyType) {
      return res.status(400).json({
        message: "Name, address, city, region and property type are required.",
      });
    }

    const enumError = validateEnums({ region, propertyType });
    if (enumError) {
      return res.status(400).json({ message: enumError });
    }

    const imageError = validateImages(images);
    if (imageError) {
      return res.status(400).json({ message: imageError });
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
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            position: index,
          })),
        },
      },
      include: {
        images: { orderBy: { position: "asc" } },
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
        images: { orderBy: { position: "asc" }, take: 1 },
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
        images: { orderBy: { position: "asc" } },
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

    const enumError = validateEnums({ region, propertyType });
    if (enumError) {
      return res.status(400).json({ message: enumError });
    }

    const existing = await prisma.property.findFirst({
      where: { id: req.params.id, landlordId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Property not found." });
    }

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: { name, address, city, region, propertyType, description },
      include: {
        images: { orderBy: { position: "asc" } },
      },
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
