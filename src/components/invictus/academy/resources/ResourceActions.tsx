"use client";

import { Edit, Trash2 } from "lucide-react";

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
} from "@/components/ui/alert-dialog";

interface Props {
  onEdit: () => void;

  onArchive: () => void;
}

export default function ResourceActions({
  onEdit,

  onArchive,
}: Props) {
  return (
    <div
      className="
flex
gap-2
justify-center
"
    >
      <button
        onClick={onEdit}
        className="
cursor-pointer
w-9
h-9
rounded-xl
border
border-[#2A3441]
text-gray-300
flex
items-center
justify-center
hover:border-[#C9A84C]
transition
"
      >
        <Edit size={16} />
      </button>

      <AlertDialog>
        <AlertDialogTrigger >
          <button
            className="
cursor-pointer
w-9
h-9
rounded-xl
border
border-red-500/20
text-red-400
flex
items-center
justify-center
hover:bg-red-500/10
transition
"
          >
            <Trash2 size={16} />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className="
bg-[#151B23]
border-[#2A3441]
text-white
"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Resource?</AlertDialogTitle>

            <AlertDialogDescription
              className="
text-gray-400
"
            >
              This resource will be archived and hidden from users.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="
cursor-pointer
"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={onArchive}
              className="
cursor-pointer
bg-red-500
hover:bg-red-600
"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
