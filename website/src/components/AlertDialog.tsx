import { type FunctionComponent } from "react";

import {
  AlertDialog as AlertDialogBase,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Loader } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  handleCancel: () => void;
  handleContinue: () => void;
  isLoading?: boolean;
}

const AlertDialog: FunctionComponent<Props> = ({
  isOpen,
  title,
  description,
  handleCancel,
  handleContinue,
  isLoading = false,
}: Props) => {
  return (
    <AlertDialogBase open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogBase>
  );
};

export default AlertDialog;
