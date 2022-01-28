export function mockType<T extends (...args: unknown[]) => unknown>(
  func: T
): jest.Mock<ReturnType<T>> {
  return func as unknown as jest.Mock<ReturnType<T>>;
}
