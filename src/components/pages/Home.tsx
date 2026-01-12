import { memo, useEffect, type FC } from "react";
import { Box, Center, Dialog, Heading, Spinner } from "@chakra-ui/react";

import { HistoriesTable } from "../organisms/HistoriesTable";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { RegisterDialog } from "../organisms/RegisterDialog";

export const Home: FC = memo(() => {
  const {
    getStudyHistory,
    loading,
    insertStudyHistory,
    deleteStudyHistory,
    updateStudyHistory,
  } = useStudyHistory();

  useEffect(() => {
    getStudyHistory();
  }, []);

  return (
    <>
      <Heading
        as={"h1"}
        size={"4xl"}
        color={"blue.500"}
        textAlign={"center"}
        pt={10}
      >
        Study History App
      </Heading>

      <Box w={{ base: "400px", md: "800px" }} mx="auto" mt={8}>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <PrimaryButton loading={loading}>新規登録</PrimaryButton>
            </Box>
          </Dialog.Trigger>

          <RegisterDialog
            getStudyHistory={getStudyHistory}
            insertStudyHistory={insertStudyHistory}
          />
        </Dialog.Root>

        {loading ? (
          <Center>
            <Spinner role="status" aria-label="loading" size="lg" mt={20} />
          </Center>
        ) : (
          <HistoriesTable
            getStudyHistory={getStudyHistory}
            deleteStudyHistory={deleteStudyHistory}
            updateStudyHistory={updateStudyHistory}
          />
        )}
      </Box>
    </>
  );
});
