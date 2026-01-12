import { memo, type FC } from "react";
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
import { useForm } from "react-hook-form";
import { useMessage } from "@/hooks/useMessage";
import type { RegisterFormValue } from "@/types/registerFormValue";

type Props = {
  getStudyHistory: () => Promise<void>;
  insertStudyHistory: (data: RegisterFormValue) => Promise<void>;
};

export const RegisterDialog: FC<Props> = memo((props) => {
  const { getStudyHistory, insertStudyHistory } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValue>({
    defaultValues: {
      title: "",
      time: "",
    },
  });
  const { showMessage } = useMessage();

  const onSubmit = handleSubmit(async (data: RegisterFormValue) => {
    await insertStudyHistory(data);

    await getStudyHistory();

    reset({
      title: "",
      time: "",
    });
    showMessage({ type: "success", title: "新規登録しました" });
  });

  const onClose = () => {
    reset({
      title: "",
      time: "",
    });
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>新規登録</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
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
                    {...register("title", { required: "内容の入力は必須です" })}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.time}>
                  <Field.Label>
                    Time (h) <FieldRequiredIndicator />
                  </Field.Label>
                  <Input
                    type="number"
                    step="any"
                    {...register("time", {
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                      required: "時間の入力は必須です",
                      min: {
                        value: 0,
                        message: "時間は0以上で入力してください",
                      },
                    })}
                  />
                  <Field.ErrorText>{errors.time?.message}</Field.ErrorText>
                </Field.Root>

                <Button type="submit">Register</Button>
              </Stack>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
});
