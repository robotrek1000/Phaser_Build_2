export const debounce = <TArgs extends unknown[]>(
  fn: (...args: TArgs) => unknown,
  delay = 300
): ((...args: TArgs) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
