import userData from "./json/user.json";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value) {
  return String(value).replace(/\D/g, "");
}

export async function loginRequest({ phone, password }) {
  await delay(800);

  const found = userData.users.find(
    (user) =>
      normalize(user.phone) === normalize(phone) && user.password === password,
  );

  if (!found) {
    throw new Error("Invalid phone number or password");
  }

  const { password: _removed, ...safeUser } = found;

  return {
    success: true,
    message: "Login successful",
    data: {
      user: safeUser,
      tokens: {
        accessToken: "mock-access-token-123456",
        refreshToken: "mock-refresh-token-789012",
      },
    },
  };
}

export async function signupRequest({ firstName, lastName, phone, password }) {
  await delay(800);

  const taken = userData.users.find(
    (user) => normalize(user.phone) === normalize(phone),
  );

  if (taken) {
    throw new Error("An account with that phone number already exists");
  }

  return {
    success: true,
    message: "Account created successfully",
    data: {
      user: {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        role: "landlord",
        isVerified: false,
        profile: { avatar: "/images/avatar.png", bio: "" },
      },
      tokens: {
        accessToken: "mock-access-token-123456",
        refreshToken: "mock-refresh-token-789012",
      },
    },
  };
}