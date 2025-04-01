
import React from "react";
import { WorkShift } from "@/utils/payCalculator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface ShiftListProps {
  shifts: WorkShift[];
  onDeleteShift: (id: string) => void;
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts, onDeleteShift }) => {
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteShift(shift.id)}
                    aria-label="Delete shift"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShiftList;
