import prisma from "../lib/prisma.js";

const owned = (userId) => ({
  lease: { unit: { property: { landlordId: userId } } },
});

export const createPayment = async (req, res) => {
  try {
    const { leaseId, amount, method, paidAt, note, coversFrom, coversTo } =
      req.body;

    if (!leaseId || amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Lease and amount are required.",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "The amount has to be more than zero.",
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
  } catch (error) {
    console.error("createPayment:", error);
    res.status(500).json({
      message: "Couldn't record the payment. Please try again.",
    });
  }
};

export const getPayments = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("getPayments:", error);
    res.status(500).json({ message: "Couldn't load your payments." });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { id: req.params.id, ...owned(req.userId) },
      include: {
        lease: {
          select: {
            id: true,
            tenant: {
              select: { firstName: true, lastName: true, phone: true },
            },
            unit: { select: { id: true, unitLabel: true } },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("getPayment:", error);
    res.status(500).json({ message: "Couldn't load the payment." });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { amount, method, paidAt, note } = req.body;

    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({
        message: "The amount has to be more than zero.",
      });
    }

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
  } catch (error) {
    console.error("updatePayment:", error);
    res.status(500).json({ message: "Couldn't save the changes." });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const existing = await prisma.payment.findFirst({
      where: { id: req.params.id, ...owned(req.userId) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Payment not found." });
    }

    await prisma.payment.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Payment deleted." });
  } catch (error) {
    console.error("deletePayment:", error);
    res.status(500).json({ message: "Couldn't delete the payment." });
  }
};
