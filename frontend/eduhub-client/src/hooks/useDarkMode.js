import { useEffect, useState } from "react";

export default function useDarkMode(defaultValue = false) {
  const [dark, setDark] = useState(() => {
    try {
      const val = localStorage.getItem("eduhub:dark");
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("eduhub:dark", JSON.stringify(dark));
  }, [dark]);

  return [dark, setDark];
}
