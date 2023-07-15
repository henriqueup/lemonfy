import { useGlobalStore } from "@/store/global/globalStore";

export const setGlobalLoading = (isLoading: boolean) =>
  useGlobalStore.setState(() => ({ isLoading }));
