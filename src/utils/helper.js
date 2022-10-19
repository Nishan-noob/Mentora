export const prettifyId = (id) => {
  if (!id) {
    return;
  }
  return id.slice(0, 2).toUpperCase() + " " + id.slice(2);
};

export const generateAvatarText = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
