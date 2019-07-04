export function pluckUndefinedObjectValues<T extends {}>(subject: T) {
  Object.keys(subject).forEach(
    key => subject[key] === undefined && delete subject[key]
  );
}
