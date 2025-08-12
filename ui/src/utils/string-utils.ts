export const rearrangeName = (name: string) => {
  const [lastName, firstName] = name.split(", ").map((str) => str.trim());
  return `${firstName} ${lastName}`;
};

export const getInitials = (name: string) => {
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest[rest.length - 1];
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const toPascalCaseWithSpaces = (field: string) => {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const convertToSnakeCase = (input: string) => {
  return input.toLowerCase().replace(/ /g, "_");
};
