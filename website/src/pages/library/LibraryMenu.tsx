import { useRouter } from "next/router";
import { useState, type FunctionComponent } from "react";

import { Button, CollapsableSideMenu } from "src/components";

const LibraryMenu: FunctionComponent = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleChangeIsOpen = (value: boolean) => setIsOpen(value);

  const handleCreateSong = () => {
    void router.push("/editor");
  };

  return (
    <CollapsableSideMenu
      isOpen={isOpen}
      onChangeIsOpen={handleChangeIsOpen}
      label="Library Menu"
    >
      <div className="flex h-full flex-col">
        <div className="mb-2 ml-auto mr-auto mt-2 flex w-full justify-center">
          <h3 className="m-auto">Library Menu</h3>
        </div>
        <Button
          variant="primary"
          text="Create Song"
          onClick={handleCreateSong}
          className="mt-6 w-2/5 self-center"
        />
      </div>
    </CollapsableSideMenu>
  );
};

export default LibraryMenu;
