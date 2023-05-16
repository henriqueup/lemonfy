import { type FunctionComponent } from "react";
import { ThemeButton } from "src/components/themeButton";
import { classNames } from "src/styles/utils";

const TopbarMenu: FunctionComponent = () => {
  return (
    <div
      className={classNames(
        "absolute left-0 top-0 z-50 flex h-8 w-screen",
        "border-b-[1px] border-solid border-b-stone-600 bg-inherit text-inherit dark:border-b-stone-400",
      )}
    >
      <div className="right-0">
        <ThemeButton />
      </div>
    </div>
  );
};

export default TopbarMenu;
