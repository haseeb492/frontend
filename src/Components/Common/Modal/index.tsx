import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import { Icon } from "@iconify/react";

type ModalProps = {
  className?: string;
  children: React.ReactNode;
  title?: string;
  triggerButton?: React.ReactNode;
  footerElement?: React.ReactNode;
  open?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void;
  hideHeader?: boolean;
};

const Modal = ({
  title,
  open,
  triggerButton,
  className,
  onOpenChange,
  children,
  footerElement,
  hideHeader,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className={className} id="dialog-description">
        <DialogHeader>
          {!hideHeader && (
            <div className="gap-sm min-h-xl py-2sm flex w-full items-center justify-between">
              {/* TODO: WE SHOULD BE USING THIS TITLE IF IT'S ALREADY HERE!!!!!!! */}
              <DialogTitle>{title}</DialogTitle>

              <DialogClose asChild>
                <Icon
                  icon="mdi:close"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  color="#18181b"
                />
              </DialogClose>
            </div>
          )}

          {children}
          <DialogDescription className="sr-only" />
        </DialogHeader>
        {footerElement && <DialogFooter>{footerElement}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export { Modal, DialogClose as ModalClose };
