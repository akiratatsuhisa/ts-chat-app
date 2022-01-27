import { useContext, createContext, FC, useState, useEffect } from "react";

export interface IThemeContext {
  isDark: boolean;
  setDarkModeHandle: (value: boolean) => void;
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
      localStorage.setItem("isDark", "true");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("isDark");
    }
  }, [isDark]);

  const setDarkModeHandle = (value: boolean) => setIsdark(value);

  const value: IThemeContext = {
    isDark,
    setDarkModeHandle,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
