
import React, { useState } from "react";
import { WorkShift } from "@/utils/payCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { X, Edit, Save, X as Cancel } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ShiftListProps {
  shifts: WorkShift[];
  onDeleteShift: (id: string) => void;
  onEditShift: (shift: WorkShift) => void;
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts, onDeleteShift, onEditShift }) => {
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  const [tempStartTime, setTempStartTime] = useState<string>("");
  const [tempEndTime, setTempEndTime] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditClick = (shift: WorkShift) => {
    setEditingShift(shift);
    setTempDate(new Date(shift.date));
    setTempStartTime(shift.startTime);
    setTempEndTime(shift.endTime);
    setDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingShift && tempDate) {
      const updatedShift: WorkShift = {
        ...editingShift,
        date: tempDate,
        startTime: tempStartTime,
        endTime: tempEndTime
      };
      onEditShift(updatedShift);
      setDialogOpen(false);
      setEditingShift(null);
    }
  };

  if (shifts.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No shifts added yet. Add your first shift above.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-lg">Your Shifts</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  {format(shift.date, "EEE, MMM d, yyyy")}
                </TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(shift)}
                      aria-label="Edit shift"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteShift(shift.id)}
                      aria-label="Delete shift"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>
              Update the date and times for this shift.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-date" className="block text-sm font-medium">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempDate && "text-muted-foreground"
                    )}
                  >
                    {tempDate ? format(tempDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempDate}
                    onSelect={setTempDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-start-time" className="block text-sm font-medium">
                Start Time
              </label>
              <Input
                id="edit-start-time"
                type="time"
                value={tempStartTime}
                onChange={(e) => setTempStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-end-time" className="block text-sm font-medium">
                End Time
              </label>
              <Input
                id="edit-end-time"
                type="time"
                value={tempEndTime}
                onChange={(e) => setTempEndTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-coop-primary hover:bg-coop-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftList;
