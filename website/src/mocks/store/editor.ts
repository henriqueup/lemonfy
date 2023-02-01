import { INITIAL_STATE } from "@store/editor";
import { createStoreMock } from "src/mocks/store";

export const mockUseEditorStore = createStoreMock()(() => INITIAL_STATE);
const mockUseEditorStoreGetter = jest.fn<typeof mockUseEditorStore, never>();

jest.mock("@store/editor/editorStore", () => ({
  get useEditorStore() {
    return mockUseEditorStoreGetter();
  },
}));

beforeAll(() => {
  mockUseEditorStoreGetter.mockReturnValue(mockUseEditorStore);
});
