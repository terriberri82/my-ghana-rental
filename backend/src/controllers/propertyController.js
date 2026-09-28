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

// Confirms this landlord owns the property before touching its photos.
const findOwnedProperty = (propertyId, landlordId) =>
  prisma.property.findFirst({
    where: { id: propertyId, landlordId },
  });

// Sends back the property's photos in display order.
const sendImages = async (res, propertyId) => {
  const images = await prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: { position: "asc" },
  });

  res.status(200).json({ images });
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

// Adds photos to a property that already exists.
export const addPropertyImages = async (req, res) => {
  try {
    const { images = [] } = req.body;

    const property = await findOwnedProperty(req.params.id, req.userId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const imageError = validateImages(images);
    if (imageError) {
      return res.status(400).json({ message: imageError });
    }

    if (images.length === 0) {
      return res.status(400).json({ message: "No photos to add." });
    }

    const existingCount = await prisma.propertyImage.count({
      where: { propertyId: property.id },
    });

    if (existingCount + images.length > MAX_IMAGES) {
      const room = MAX_IMAGES - existingCount;
      return res.status(400).json({
        message:
          room === 0
            ? `This property already has ${MAX_IMAGES} photos.`
            : `You can only add ${room} more ${room === 1 ? "photo" : "photos"}.`,
      });
    }

    await prisma.propertyImage.createMany({
      data: images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        position: existingCount + index,
        propertyId: property.id,
      })),
    });

    await sendImages(res, property.id);
  } catch (error) {
    console.error("addPropertyImages:", error);
    res.status(500).json({ message: "Couldn't add the photos." });
  }
};

// Removes one photo, then closes the gap it left in the ordering.
export const deletePropertyImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const property = await findOwnedProperty(id, req.userId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId: property.id },
    });

    if (!image) {
      return res.status(404).json({ message: "Photo not found." });
    }

    await prisma.$transaction([
      prisma.propertyImage.delete({ where: { id: image.id } }),
      prisma.propertyImage.updateMany({
        where: { propertyId: property.id, position: { gt: image.position } },
        data: { position: { decrement: 1 } },
      }),
    ]);

    await sendImages(res, property.id);
  } catch (error) {
    console.error("deletePropertyImage:", error);
    res.status(500).json({ message: "Couldn't remove the photo." });
  }
};

// Makes one photo the cover by swapping it with whatever sits at position 0.
export const setCoverImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const property = await findOwnedProperty(id, req.userId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId: property.id },
    });

    if (!image) {
      return res.status(404).json({ message: "Photo not found." });
    }

    if (image.position === 0) {
      return sendImages(res, property.id);
    }

    const currentCover = await prisma.propertyImage.findFirst({
      where: { propertyId: property.id, position: 0 },
    });

    await prisma.$transaction([
      prisma.propertyImage.update({
        where: { id: image.id },
        data: { position: 0 },
      }),
      ...(currentCover
        ? [
            prisma.propertyImage.update({
              where: { id: currentCover.id },
              data: { position: image.position },
            }),
          ]
        : []),
    ]);

    await sendImages(res, property.id);
  } catch (error) {
    console.error("setCoverImage:", error);
    res.status(500).json({ message: "Couldn't set the cover photo." });
  }
};