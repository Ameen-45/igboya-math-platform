export const login = (user) => {
  localStorage.setItem("igboya_user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("igboya_user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("igboya_user"));
};

export const isAuthenticated = () => {
  return localStorage.getItem("igboya_user") !== null;
};