const excludeFields = <T extends object, K extends keyof T>(obj: T, fieldsToExclude: K[]): Omit<T, K> => {
  const copy = { ...obj };
  fieldsToExclude.forEach((field) => {
    delete copy[field];
  });
  return copy;
};

export default excludeFields;
