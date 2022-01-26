import { useContext, createContext, FC, useState, useEffect } from "react";

export interface IThemeContext {
  isDark: boolean;
  setThemeModeHandle: (isDark: boolean) => void;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const useTheme = (): IThemeContext => {
  return useContext(ThemeContext);
};

export const ThemeProvider: FC = ({ children }) => {
  const [isDark, setIsdark] = useState<boolean>(
    Boolean(localStorage.getItem("isDark")) || false
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setThemeModeHandle = (isDark: boolean): void => {
    setIsdark(isDark);
    if (isDark) {
      localStorage.setItem("isDark", "true");
    } else {
      localStorage.removeItem("isDark");
    }

    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  };

  const value: IThemeContext = {
    isDark,
    setThemeModeHandle,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
