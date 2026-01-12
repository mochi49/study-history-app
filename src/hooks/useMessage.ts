import { useCallback } from "react";
import { toaster } from "@/components/ui/toaster";

type Props = {
  title: string;
  type: "info" | "warning" | "error" | "success";
};

export const useMessage = () => {
  const showMessage = useCallback((props: Props) => {
    const { title, type } = props;

    toaster.create({
      title,
      type,
      duration: 2000,
      closable: true,
    });
  }, []);

  return { showMessage };
};
