import { createContext } from "react";

interface SnackBarContextProps {
  snackBar: string;
  setSnackBar: (value: string) => void;
}

export const SnackBarContext = createContext<SnackBarContextProps>({
  snackBar: "",
  setSnackBar: () => {},
});
