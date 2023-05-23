import { type FunctionComponent } from "react";

import { ThemeButton } from "src/components/themeButton";
import Logo from "src/icons/Logo";
import { classNames } from "src/styles/utils";

const TopbarMenu: FunctionComponent = () => {
  return (
    <div
      className={classNames(
        "absolute left-0 top-0 z-30 flex h-8 w-screen",
        "border-b-[1px] border-solid border-b-stone-600 bg-inherit text-inherit dark:border-b-stone-400",
      )}
    >
      <div className="flex flex-grow justify-start">
        <div className="cursor-pointer">
          <Logo height={30} width={30} />
        </div>
      </div>
      <div className="flex flex-grow justify-end">
        <ThemeButton />
      </div>
    </div>
  );
};

export default TopbarMenu;
