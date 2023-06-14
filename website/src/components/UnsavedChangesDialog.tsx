import { useRouter } from "next/router";
import {
  useState,
  type FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

interface Props {
  shouldConfirmLeave: boolean;
}

const UnsavedChangesDialog: FunctionComponent<Props> = ({
  shouldConfirmLeave,
}: Props) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const nextPathRef = useRef("");

  const router = useRouter();

  const handleWindowClose = useCallback(
    (e: BeforeUnloadEvent) => {
      console.log("unload", e);
      if (!shouldConfirmLeave) return;

      e.preventDefault();
    },
    [shouldConfirmLeave],
  );

  const handleBrowseAway = useCallback(
    (nextPath: string) => {
      if (!shouldConfirmLeave || nextPath === router.asPath) {
        return;
      }

      setIsOpenDialog(true);
      nextPathRef.current = nextPath;

      router.events.emit("routeChangeError", ROUTE_CHANGE_ERROR, nextPath, {
        shallow: false,
      });
      throw ROUTE_CHANGE_ERROR;
    },
    [shouldConfirmLeave, router],
  );

  const handleRouteError = useCallback(
    (err: string, url: string) => {
      if (err !== ROUTE_CHANGE_ERROR) return;
      // console.log(err, url, router.asPath);

      // if (url !== router.asPath) {
      //   console.log(history.state);
      void router.push(router.asPath, undefined, { shallow: true });
      // }
    },
    [router],
  );

  const addListeners = useCallback(() => {
    router.events.on("routeChangeStart", handleBrowseAway);
    router.events.on("routeChangeError", handleRouteError);

    window.addEventListener("beforeunload", handleWindowClose);
  }, [router, handleBrowseAway, handleRouteError, handleWindowClose]);

  const removeListeners = useCallback(() => {
    router.events.off("routeChangeStart", handleBrowseAway);
    router.events.off("routeChangeError", handleRouteError);

    window.removeEventListener("beforeunload", handleWindowClose);
  }, [router.events, handleBrowseAway, handleRouteError, handleWindowClose]);

  const handleCancelLeave = () => {
    nextPathRef.current = "";
    setIsOpenDialog(false);
  };

  const handleConfirmLeave = () => {
    setIsOpenDialog(false);

    removeListeners();
    void router.push(nextPathRef.current);
  };

  useEffect(() => {
    addListeners();

    return removeListeners;
  }, [addListeners, removeListeners]);

  return (
    <AlertDialog open={isOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Leaving this page will discard unsaved changes. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelLeave}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmLeave}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ROUTE_CHANGE_ERROR =
  "Error used to stop redirect and loose unsaved changes. Safe to ignore.";

export default UnsavedChangesDialog;
