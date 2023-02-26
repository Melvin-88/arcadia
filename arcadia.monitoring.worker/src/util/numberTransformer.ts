export const numberTransform = ({ value }) => {
  const result = parseFloat(value);
  if (Number.isNaN(result)) {
    return undefined;
  }
  return result;
};
