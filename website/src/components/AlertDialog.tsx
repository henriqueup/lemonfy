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

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  handleCancel: () => void;
  handleContinue: () => void;
}

const AlertDialog: FunctionComponent<Props> = ({
  isOpen,
  title,
  description,
  handleCancel,
  handleContinue,
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
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogBase>
  );
};

export default AlertDialog;
