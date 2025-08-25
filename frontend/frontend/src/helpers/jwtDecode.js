import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
