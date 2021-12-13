export function decorateStaticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
