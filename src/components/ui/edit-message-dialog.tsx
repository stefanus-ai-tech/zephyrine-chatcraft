import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface EditMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
  onSave: (editedContent: string) => void;
}

export const EditMessageDialog: React.FC<EditMessageDialogProps> = ({ isOpen, onClose, messageContent, onSave }) => {
  const [editedText, setEditedText] = useState(messageContent);

  useEffect(() => {
    setEditedText(messageContent);
  }, [messageContent]);

  const handleSave = () => {
    onSave(editedText);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Message</AlertDialogTitle>
          <AlertDialogDescription>
            Make your changes and click Finish Editing to save.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Edit your message here..."
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Finish Editing</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
