
import React from "react";
import { WorkShift } from "@/utils/payCalculator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";

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
      <div className="rounded-md border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                End Time
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-4 py-3 text-sm">
                  {format(shift.date, "EEE, MMM d, yyyy")}
                </td>
                <td className="px-4 py-3 text-sm">{shift.startTime}</td>
                <td className="px-4 py-3 text-sm">{shift.endTime}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteShift(shift.id)}
                    aria-label="Delete shift"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftList;
