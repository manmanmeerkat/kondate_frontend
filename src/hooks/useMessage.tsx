import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useCallback } from "react";

interface MessageProps {
  title: string;
  status: "info" | "warning" | "success" | "error";
}

export const useMessage = () => {
  const toast = useToast();

  const showMessage = useCallback(({ title, status }: MessageProps) => {
    const toastOptions: UseToastOptions = {
      title,
      status,
      position: "top",
      duration: 2000,
      isClosable: true,
    };
    toast(toastOptions);
  }, [toast]);

  return { showMessage };
};
