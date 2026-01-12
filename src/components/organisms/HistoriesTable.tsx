import { memo, type FC } from "react";
import { Dialog, IconButton, Table } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { MdDelete, MdEdit } from "react-icons/md";

import { UpdateDialog } from "./UpdateDialog";
import { historiesAtom } from "@/stores/atom";
import type { History } from "@/types/history";

type Props = {
  getStudyHistory: () => Promise<void>;
  deleteStudyHistory: (id: string) => Promise<void>;
  updateStudyHistory: (
    history: Pick<History, "id" | "title" | "time">
  ) => Promise<void>;
};

export const HistoriesTable: FC<Props> = memo((props) => {
  const histories = useAtomValue(historiesAtom);
  const { getStudyHistory, deleteStudyHistory, updateStudyHistory } = props;

  const onClickDelete = async (id: string): Promise<void> => {
    await deleteStudyHistory(id);
    await getStudyHistory();
  };

  return (
    <Table.Root size={"md"} striped>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader textAlign={"start"}>Title</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"end"}>Time (h)</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"end"}>Created At</Table.ColumnHeader>
          <Table.ColumnHeader />
          <Table.ColumnHeader />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {histories.map((history) => (
          <Table.Row key={history.id}>
            <Table.Cell textAlign={"start"}>{history.title}</Table.Cell>
            <Table.Cell textAlign={"end"}>{history.time}</Table.Cell>
            <Table.Cell textAlign={"end"}>{history.createdAtLabel}</Table.Cell>
            <Table.Cell textAlign={"center"}>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <IconButton
                    aria-label="Edit History"
                    key={history.id}
                    variant="ghost"
                  >
                    <MdEdit />
                  </IconButton>
                </Dialog.Trigger>
                <UpdateDialog
                  history={history}
                  getStudyHistory={getStudyHistory}
                  updateStudyHistory={updateStudyHistory}
                />
              </Dialog.Root>
            </Table.Cell>
            <Table.Cell textAlign={"center"}>
              <IconButton
                aria-label="Delete History"
                key={history.id}
                variant="ghost"
                onClick={() => onClickDelete(history.id)}
              >
                <MdDelete />
              </IconButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
});
