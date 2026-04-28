export const saveProgress = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getProgress = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const clearProgress = (key) => {
  localStorage.removeItem(key);
};