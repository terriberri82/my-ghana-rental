import prisma from "../lib/prisma.js";

export const dismissOnboarding = async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { onboardingDismissed: true },
    select: { id: true, onboardingDismissed: true },
  });

  res.status(200).json({ user });
};