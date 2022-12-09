import { createContext, useContext, useState, ReactNode, FunctionComponent } from "react";
import Sheet from "../../entities/sheet";

const SheetContext = createContext<{ sheet: Sheet; refresh: (sheet: Sheet) => void }>({
  sheet: new Sheet(1),
  refresh: () => {},
});

export const useSheet = () => {
  return useContext(SheetContext);
};

type SheetProviderProps = {
  children: ReactNode;
};

export const SheetProvider: FunctionComponent<SheetProviderProps> = ({ children }) => {
  const [sheet, setSheet] = useState(new Sheet(1));
  const refresh = (newSheet: Sheet) => {
    setSheet({ ...newSheet });
  };

  return <SheetContext.Provider value={{ sheet, refresh }}>{children}</SheetContext.Provider>;
};
