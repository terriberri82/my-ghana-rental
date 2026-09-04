import userData from "./json/user.json";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginRequest({ email, password }) {
  await delay(800);

  const found = userData.users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!found) {
    throw new Error("Invalid email or password");
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

export async function signupRequest({ firstName, lastName, email, role }) {
  await delay(800);

  const taken = userData.users.find((user) => user.email === email);

  if (taken) {
    throw new Error("An account with that email already exists");
  }

  return {
    success: true,
    message: "Account created successfully",
    data: {
      user: {
        id: Date.now(),
        firstName,
        lastName,
        email,
        role,
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
