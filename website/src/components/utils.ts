import { classNames } from "src/styles/utils";

export const areParentsRelative = (parent: HTMLElement): boolean => {
  if (parent.classList.contains("relative")) return true;
  if (parent.parentElement) return areParentsRelative(parent.parentElement);

  return false;
};

export const iconClassName = classNames(
  "flex cursor-pointer items-center rounded-full p-1 outline-none",
  "hover:bg-white hover:bg-opacity-20 focus-visible:bg-white focus-visible:bg-opacity-20",
);
