import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useCallback } from "react";

// メッセージ表示用のカスタムフック
interface MessageProps {
  title: string; // トーストメッセージのタイトル
  status: "info" | "warning" | "success" | "error"; // トーストメッセージのステータス（情報、警告、成功、エラー）
}

export const useMessage = () => {
  const toast = useToast(); // Chakra UI のトーストフックを取得

  // トーストメッセージを表示する関数
  const showMessage = useCallback(({ title, status }: MessageProps) => {
    const toastOptions: UseToastOptions = {
      title, // トーストメッセージのタイトル
      status, // トーストメッセージのステータス
      position: "top", // トーストメッセージの表示位置
      duration: 2000, // トーストメッセージの表示時間（ミリ秒）
      isClosable: true, // トーストメッセージにクローズボタンを表示
    };
    toast(toastOptions); // トーストメッセージを表示
  }, [toast]);

  return { showMessage }; // メッセージ表示関数を返す
};
