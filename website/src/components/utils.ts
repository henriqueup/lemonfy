export const areParentsRelative = (parent: HTMLElement): boolean => {
  if (parent.classList.contains("relative")) return true;
  if (parent.parentElement) return areParentsRelative(parent.parentElement);

  return false;
};
