import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { Provider } from "@/components/ui/provider";

const mockSupabaseFrom = jest.fn();

jest.mock("@/utils/supabase", () => ({
  __esModule: true,
  default: {
    from: (...args: unknown[]) => mockSupabaseFrom(...args),
  },
}));

jest.mock("@/env", () => ({
  env: {
    VITE_SUPABASE_URL: "https://example.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "public-anonymous-key",
    VITE_SUPABASE_DB_NAME: "study_history",
  },
}));

const renderApp = () =>
  render(
    <Provider>
      <App />
    </Provider>
  );

const setupSupabaseMock = () => {
  const selectMock = jest.fn();
  const returnsMock = jest.fn();
  const insertMock = jest.fn();
  const deleteMock = jest.fn();
  const updateMock = jest.fn();
  const eqMock = jest.fn();

  selectMock.mockReturnValue({ returns: returnsMock });
  deleteMock.mockReturnValue({ eq: eqMock });
  updateMock.mockReturnValue({ eq: eqMock });

  mockSupabaseFrom.mockReturnValue({
    select: selectMock,
    insert: insertMock,
    delete: deleteMock,
    update: updateMock,
  });

  return { selectMock, returnsMock, insertMock, deleteMock, updateMock, eqMock };
};

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  }

  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

beforeEach(() => {
  mockSupabaseFrom.mockReset();
});

test("タイトルが表示される", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  expect(
    await screen.findByRole("heading", { name: "Study History App" })
  ).toBeInTheDocument();
});

test("ローディング画面が表示される", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockImplementation(
    () =>
      new Promise(() => {
        // Keep loading state.
      })
  );

  renderApp();

  expect(await screen.findByRole("status")).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

test("テーブルが表示される", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({
    data: [
      {
        id: "history-1",
        title: "React Testing",
        time: 2,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    error: null,
  });

  renderApp();

  expect(await screen.findByRole("table")).toBeInTheDocument();
  expect(screen.getByText("React Testing")).toBeInTheDocument();
});

test("新規登録ボタンが表示される", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  expect(
    await screen.findByRole("button", { name: "新規登録" })
  ).toBeInTheDocument();
});

test("モーダルのタイトルが新規登録になっている", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  await userEvent.click(
    await screen.findByRole("button", { name: "新規登録" })
  );

  const dialog = await screen.findByRole("dialog");
  expect(within(dialog).getByText("新規登録")).toBeInTheDocument();
});

test("編集モーダルのタイトルが学習記録修正になっている", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({
    data: [
      {
        id: "history-1",
        title: "React Testing",
        time: 2,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    error: null,
  });

  renderApp();

  expect(await screen.findByRole("table")).toBeInTheDocument();

  await userEvent.click(
    await screen.findByRole("button", { name: "Edit History" })
  );

  const dialog = await screen.findByRole("dialog");
  expect(within(dialog).getByText("学習記録修正")).toBeInTheDocument();
});

test("学習記録が登録できる", async () => {
  const { returnsMock, insertMock } = setupSupabaseMock();
  returnsMock.mockResolvedValueOnce({ data: [], error: null });
  returnsMock.mockResolvedValueOnce({
    data: [
      {
        id: "history-2",
        title: "React",
        time: 3,
        createdAt: "2025-02-01T00:00:00.000Z",
      },
    ],
    error: null,
  });
  insertMock.mockResolvedValue({ error: null });

  renderApp();

  await userEvent.click(
    await screen.findByRole("button", { name: "新規登録" })
  );

  await userEvent.type(screen.getByLabelText("Title"), "React");
  await userEvent.type(screen.getByLabelText("Time (h)"), "3");
  await userEvent.click(screen.getByRole("button", { name: "Register" }));

  expect(insertMock).toHaveBeenCalledWith({ title: "React", time: 3 });
  expect(await screen.findByText("React")).toBeInTheDocument();
});

test("編集して登録すると更新される", async () => {
  const { returnsMock, updateMock, eqMock } = setupSupabaseMock();
  returnsMock.mockResolvedValueOnce({
    data: [
      {
        id: "history-1",
        title: "React Testing",
        time: 2,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    error: null,
  });
  returnsMock.mockResolvedValueOnce({
    data: [
      {
        id: "history-1",
        title: "React Testing Updated",
        time: 5,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    error: null,
  });
  eqMock.mockResolvedValue({ error: null });

  renderApp();

  expect(await screen.findByText("React Testing")).toBeInTheDocument();

  await userEvent.click(
    await screen.findByRole("button", { name: "Edit History" })
  );

  await userEvent.clear(screen.getByLabelText("Title"));
  await userEvent.type(screen.getByLabelText("Title"), "React Testing Updated");
  await userEvent.clear(screen.getByLabelText("Time (h)"));
  await userEvent.type(screen.getByLabelText("Time (h)"), "5");

  await userEvent.click(screen.getByRole("button", { name: "Update" }));

  expect(updateMock).toHaveBeenCalledWith({
    title: "React Testing Updated",
    time: 5,
  });
  expect(eqMock).toHaveBeenCalledWith("id", "history-1");
  expect(await screen.findByText("React Testing Updated")).toBeInTheDocument();
});

test("学習内容がないときに登録するとエラーがでる", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  await userEvent.click(
    await screen.findByRole("button", { name: "新規登録" })
  );

  await userEvent.type(screen.getByLabelText("Time (h)"), "2");
  await userEvent.click(screen.getByRole("button", { name: "Register" }));

  expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
});

test("学習時間がないときに登録するとエラーがでる", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  await userEvent.click(
    await screen.findByRole("button", { name: "新規登録" })
  );

  await userEvent.type(screen.getByLabelText("Title"), "React");
  await userEvent.click(screen.getByRole("button", { name: "Register" }));

  expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
});

test("学習時間が0未満のときにエラーがでる", async () => {
  const { returnsMock } = setupSupabaseMock();
  returnsMock.mockResolvedValue({ data: [], error: null });

  renderApp();

  await userEvent.click(
    await screen.findByRole("button", { name: "新規登録" })
  );

  await userEvent.type(screen.getByLabelText("Title"), "React");
  await userEvent.type(screen.getByLabelText("Time (h)"), "-1");
  await userEvent.click(screen.getByRole("button", { name: "Register" }));

  expect(screen.getByText("時間は0以上で入力してください")).toBeInTheDocument();
});

test("学習記録が削除できる", async () => {
  const { returnsMock, eqMock } = setupSupabaseMock();
  returnsMock.mockResolvedValueOnce({
    data: [
      {
        id: "history-1",
        title: "React Testing",
        time: 2,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    error: null,
  });
  returnsMock.mockResolvedValueOnce({ data: [], error: null });
  eqMock.mockResolvedValue({ error: null });

  renderApp();

  const deleteButton = await screen.findByRole("button", {
    name: "Delete History",
  });
  await userEvent.click(deleteButton);

  expect(eqMock).toHaveBeenCalledWith("id", "history-1");
});
