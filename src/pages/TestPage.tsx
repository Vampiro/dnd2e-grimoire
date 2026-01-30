import { useState } from "react";
import { SelectWithSearch } from "@/components/custom/SelectWithSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const testItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Test Item ${i + 1}`,
}));

export function TestPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Custom Page</h1>
      <div className="flex items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Test Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>
                Use this to validate the close button behavior (including Apple
                Pencil).
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Open Emergency Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emergency Dialog</AlertDialogTitle>
              <AlertDialogDescription>
                This is a test alert dialog to verify Apple Pencil button taps.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Proceed</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <SelectWithSearch
          items={testItems}
          getLabel={(item) => item.name}
          getKey={(item) => item.id.toString()}
          getCategory={(item) => {
            if (item.id % 2 === 0) return "Even";
            return "Odd";
          }}
        />
      </div>
    </div>
  );
}
