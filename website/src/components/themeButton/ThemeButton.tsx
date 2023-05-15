import { type FunctionComponent, useEffect, useState } from "react";
import { ButtonContainer } from "src/components/buttonContainer";
import { Moon, Sun } from "src/icons";

const ThemeButton: FunctionComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleClickThemeButton = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      return;
    }

    setIsDarkMode(true);
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  };

  return (
    <ButtonContainer className="m-3" onClick={handleClickThemeButton}>
      {isDarkMode ? (
        <Sun width={24} height={24} />
      ) : (
        <Moon width={24} height={24} />
      )}
    </ButtonContainer>
  );
};

export default ThemeButton;
