export const areParentsRelativeOrAbsolute = (parent: HTMLElement): boolean => {
  if (parent.classList.contains("relative") || parent.classList.contains("absolute")) return true;
  if (parent.parentElement) return areParentsRelativeOrAbsolute(parent.parentElement);

  return false;
};
