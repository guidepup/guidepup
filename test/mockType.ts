/* eslint-disable @typescript-eslint/no-explicit-any */
export function mockType<T extends (...args: any[]) => any>(
  func: T
): jest.Mock<ReturnType<T>> {
  return func as unknown as jest.Mock<ReturnType<T>>;
}
