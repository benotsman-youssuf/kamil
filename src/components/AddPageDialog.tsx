import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from "@/lib/db";

export function AddPageDialog() {

  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");

    try {
      if (typeof name === "string" && typeof description === "string") {
        await db.pages.add({
          name,
          description,
          content: "",
        });
        toast.success("Page added successfully");
      }
    } catch (error) {
      toast.error("Failed to add page");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Page</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={addPage}>
          <DialogHeader>
            <DialogTitle>Add Page</DialogTitle>
            <DialogDescription>
              Add a new page to your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <label htmlFor="name">Page Name</label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-3">
              <label htmlFor="description">Page Description</label>
              <Input id="description" name="description" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Page </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
