import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DialogModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function DialogModal({
  children,
  isOpen,
  onClose,
  title = "Modal Title",
}: DialogModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[900px]">
        {/* <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader> */}
        <ScrollArea className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="p-6">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
