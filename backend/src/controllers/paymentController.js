import prisma from "../lib/prisma.js";

const owned = (userId) => ({
  lease: { unit: { property: { landlordId: userId } } },
});

export const createPayment = async (req, res) => {
  const { leaseId, amount, method, paidAt, note, coversFrom, coversTo } =
    req.body;

  if (!leaseId || amount === undefined || amount === "") {
    return res.status(400).json({
      message: "Lease and amount are required.",
    });
  }

  const lease = await prisma.lease.findFirst({
    where: { id: leaseId, unit: { property: { landlordId: req.userId } } },
    select: { id: true, tenantId: true },
  });

  if (!lease) {
    return res.status(404).json({ message: "Lease not found." });
  }

  const payment = await prisma.payment.create({
    data: {
      leaseId,
      tenantId: lease.tenantId,
      recordedById: req.userId,
      amount,
      method: method || "MOBILE_MONEY",
      status: "SUCCESS",
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      note: note || null,
      coversFrom: coversFrom ? new Date(coversFrom) : null,
      coversTo: coversTo ? new Date(coversTo) : null,
    },
  });

  res.status(201).json({ payment });
};

export const getPayments = async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: owned(req.userId),
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      lease: {
        select: {
          id: true,
          tenant: { select: { firstName: true, lastName: true } },
          unit: {
            select: {
              id: true,
              unitLabel: true,
              property: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  res.status(200).json({ payments });
};

export const getPayment = async (req, res) => {
  const payment = await prisma.payment.findFirst({
    where: { id: req.params.id, ...owned(req.userId) },
    include: {
      lease: {
        select: {
          id: true,
          tenant: { select: { firstName: true, lastName: true } },
          unit: { select: { id: true, unitLabel: true } },
        },
      },
    },
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found." });
  }

  res.status(200).json({ payment });
};

export const updatePayment = async (req, res) => {
  const { amount, method, paidAt, note } = req.body;

  const existing = await prisma.payment.findFirst({
    where: { id: req.params.id, ...owned(req.userId) },
  });

  if (!existing) {
    return res.status(404).json({ message: "Payment not found." });
  }

  const payment = await prisma.payment.update({
    where: { id: req.params.id },
    data: {
      amount,
      method,
      note,
      paidAt: paidAt ? new Date(paidAt) : undefined,
    },
  });

  res.status(200).json({ payment });
};

export const deletePayment = async (req, res) => {
  const existing = await prisma.payment.findFirst({
    where: { id: req.params.id, ...owned(req.userId) },
  });

  if (!existing) {
    return res.status(404).json({ message: "Payment not found." });
  }

  await prisma.payment.delete({ where: { id: req.params.id } });

  res.status(200).json({ message: "Payment deleted." });
};