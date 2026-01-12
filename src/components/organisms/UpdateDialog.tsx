import { useMessage } from "@/hooks/useMessage";
import type { History } from "@/types/history";
import type { RegisterFormValue } from "@/types/registerFormValue";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  FieldRequiredIndicator,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { memo, type FC } from "react";
import { useForm } from "react-hook-form";

type Props = {
  history: History;
  getStudyHistory: () => Promise<void>;
  updateStudyHistory: (
    history: Pick<History, "id" | "title" | "time">
  ) => Promise<void>;
};

export const UpdateDialog: FC<Props> = memo((props) => {
  const { history, getStudyHistory, updateStudyHistory } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValue>();
  const { showMessage } = useMessage();

  const onSubmit = handleSubmit(async (data: RegisterFormValue) => {
    await updateStudyHistory({ ...history, ...data });

    await getStudyHistory();

    showMessage({ type: "success", title: "更新しました" });
  });

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>学習記録修正</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <form onSubmit={onSubmit}>
              <Stack gap="4" align="flex-start">
                <Field.Root invalid={!!errors.title}>
                  <Field.Label>
                    Title <FieldRequiredIndicator />
                  </Field.Label>
                  <Input
                    defaultValue={history.title}
                    {...register("title", { required: "内容の入力は必須です" })}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.time}>
                  <Field.Label>
                    Time (h) <FieldRequiredIndicator />
                  </Field.Label>
                  <Input
                    defaultValue={history.time}
                    type="number"
                    step="any"
                    {...register("time", {
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                      required: "時間の入力は必須です",
                      min: {
                        value: 0,
                        message: "時間は0で入力してください",
                      },
                    })}
                  />
                  <Field.ErrorText>{errors.time?.message}</Field.ErrorText>
                </Field.Root>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit">Update</Button>
                </Dialog.ActionTrigger>
              </Stack>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
});
