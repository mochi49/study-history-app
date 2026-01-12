import { useCallback, useState } from "react";
import { useAtom } from "jotai";

import { History, type HistoryDTO } from "@/types/history";
import supabase from "@/utils/supabase";
import { useMessage } from "./useMessage";
import type { RegisterFormValue } from "@/types/registerFormValue";
import { env } from "@/env";
import { historiesAtom } from "@/stores/atom";

const DB_NAME = env.VITE_SUPABASE_DB_NAME;

export const useStudyHistory = () => {
  const { showMessage } = useMessage();

  const [histories, setHistories] = useAtom(historiesAtom);
  const [loading, setLoading] = useState<boolean>(false);

  const getStudyHistory = useCallback(async (): Promise<void> => {
    setLoading(true);

    const { data, error } = await supabase
      .from(DB_NAME)
      .select()
      .returns<Array<HistoryDTO>>();

    if (error) {
      showMessage({ type: "error", title: "学習記録の取得に失敗しました" });
    } else {
      setHistories(data.map(History.from) ?? []);
    }

    setLoading(false);
  }, []);

  const insertStudyHistory = useCallback(
    async (history: RegisterFormValue): Promise<void> => {
      const { error } = await supabase.from(DB_NAME).insert({
        title: history.title,
        time: history.time,
      });

      if (error) {
        showMessage({ type: "error", title: "学習記録の登録に失敗しました" });
      }
    },
    [showMessage]
  );

  const deleteStudyHistory = useCallback(
    async (id: string): Promise<void> => {
      const { error } = await supabase.from(DB_NAME).delete().eq("id", id);

      if (error) {
        showMessage({ type: "error", title: "学習記録の削除に失敗しました" });
      } else {
        showMessage({ type: "success", title: "学習記録を削除しました" });
      }
    },
    [showMessage]
  );

  const updateStudyHistory = useCallback(
    async (history: Pick<History, "id" | "title" | "time">): Promise<void> => {
      const { error } = await supabase
        .from(DB_NAME)
        .update({
          title: history.title,
          time: history.time,
        })
        .eq("id", history.id);

      if (error) {
        showMessage({ type: "error", title: "学習記録の更新に失敗しました" });
      }
    },
    [showMessage]
  );

  return {
    histories,
    getStudyHistory,
    loading,
    insertStudyHistory,
    deleteStudyHistory,
    updateStudyHistory,
  };
};
