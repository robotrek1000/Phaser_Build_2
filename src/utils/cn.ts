type CN = string | false | void | null | 0 | '';

export const cn = (...args: CN[]) => {
  return Array.prototype.slice.call(args).filter(Boolean).join(' ');
};
