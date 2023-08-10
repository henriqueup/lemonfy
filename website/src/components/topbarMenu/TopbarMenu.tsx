import { type FunctionComponent } from "react";
import { useRouter } from "next/router";

import { Menubar } from "@/components/ui/Menubar";
import { ThemeButton } from "src/components/themeButton";
import Logo from "src/icons/Logo";
import FileMenu from "@/components/topbarMenu/FileMenu";
import EditMenu from "@/components/topbarMenu/EditMenu";
import CursorMenu from "@/components/topbarMenu/CursorMenu";
import { setGlobalLoading } from "@/store/global/globalActions";
import PagesMenu from "@/components/topbarMenu/PagesMenu";

const TopbarMenu: FunctionComponent = () => {
  const router = useRouter();

  const handleLogoClick = async () => {
    setGlobalLoading(true);

    try {
      await router.push("/library");
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <Menubar className="absolute left-0 top-0 w-screen">
      <div className="cursor-pointer" onClick={() => void handleLogoClick()}>
        <Logo height={30} width={30} />
      </div>
      <FileMenu />
      <PagesMenu />
      <EditMenu />
      <CursorMenu />
      <div className="flex flex-grow justify-end">
        <ThemeButton />
      </div>
    </Menubar>
  );
};

export default TopbarMenu;
