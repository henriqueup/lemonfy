import { type FunctionComponent } from "react";
import { useRouter } from "next/router";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/Menubar";

const PagesMenu: FunctionComponent = () => {
  const router = useRouter();

  const handleRedirect = (route: string) => {
    void router.push(route);
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>Pages</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => handleRedirect("/library")}>
          Library
        </MenubarItem>
        <MenubarItem onClick={() => handleRedirect("/instruments")}>
          Instruments
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => handleRedirect("/about-me")}>
          About Me
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default PagesMenu;
