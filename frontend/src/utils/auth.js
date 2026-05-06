

// Save user safely 
export const saveUser = (data) => {
  try {
    if (!data) return;

    // FIX: normalize backend response
    const userData = data?.user ? data.user : data;

    localStorage.setItem("user", JSON.stringify(userData));
  } catch (err) {
    console.log("SAVE USER ERROR:", err);
  }
};

// Get user safely
export const getUser = () => {
  try {
    const data = localStorage.getItem("user");

    if (!data || data === "undefined" || data === "null") {
      return null;
    }

    return JSON.parse(data);
  } catch (err) {
    console.log("GET USER ERROR:", err);
    return null;
  }
};

// Clear user (logout)
export const clearUser = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedUser");
  } catch (err) {
    console.log("CLEAR USER ERROR:", err);
  }
};