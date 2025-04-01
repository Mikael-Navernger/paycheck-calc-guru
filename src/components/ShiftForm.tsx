
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { WorkShift } from "@/utils/payCalculator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Plus, Copy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ShiftFormProps {
  onAddShift: (shift: WorkShift) => void;
  shifts: WorkShift[];
}

// Common shift templates
const shiftTemplates = [
  { label: "Morning (08:00-16:00)", start: "08:00", end: "16:00" },
  { label: "Afternoon (12:00-20:00)", start: "12:00", end: "20:00" },
  { label: "Evening (15:00-23:00)", start: "15:00", end: "23:00" },
  { label: "Late (18:00-23:00)", start: "18:00", end: "23:00" },
];

const ShiftForm: React.FC<ShiftFormProps> = ({ onAddShift, shifts }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("16:00");

  // State for batch shift adding
  const [batchDates, setBatchDates] = useState<Date[]>([]);
  const [batchStartTime, setBatchStartTime] = useState<string>("08:00");
  const [batchEndTime, setBatchEndTime] = useState<string>("16:00");

  // For text import
  const [importText, setImportText] = useState<string>("");

  const form = useForm({
    defaultValues: {
      template: "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      return;
    }
    
    const newShift: WorkShift = {
      id: Date.now().toString(),
      date: new Date(date),
      startTime,
      endTime,
    };
    
    onAddShift(newShift);
  };

  const applyTemplate = (templateValue: string) => {
    const template = shiftTemplates.find((t) => t.start === templateValue);
    if (template) {
      setStartTime(template.start);
      setEndTime(template.end);
      setBatchStartTime(template.start);
      setBatchEndTime(template.end);
    }
  };

  const handleBatchAdd = () => {
    if (batchDates.length === 0) {
      return;
    }

    batchDates.forEach((date) => {
      const newShift: WorkShift = {
        id: Date.now() + Math.random().toString(),
        date: new Date(date),
        startTime: batchStartTime,
        endTime: batchEndTime,
      };
      
      onAddShift(newShift);
    });

    // Reset batch dates after adding
    setBatchDates([]);
  };

  const toggleBatchDate = (date: Date) => {
    const dateStr = date.toDateString();
    const exists = batchDates.some((d) => d.toDateString() === dateStr);
    
    if (exists) {
      setBatchDates(batchDates.filter((d) => d.toDateString() !== dateStr));
    } else {
      setBatchDates([...batchDates, date]);
    }
  };

  const duplicateLatestShift = () => {
    if (shifts.length === 0) return;
    
    const latestShift = shifts[shifts.length - 1];
    const nextDay = addDays(latestShift.date, 1);
    
    const newShift: WorkShift = {
      id: Date.now().toString(),
      date: nextDay,
      startTime: latestShift.startTime,
      endTime: latestShift.endTime,
    };
    
    onAddShift(newShift);
  };

  const parseTextImport = () => {
    // Very basic parsing of text that might contain dates and times
    const lines = importText.split("\n");
    
    const shifts: WorkShift[] = [];
    const dateRegex = /(\d{1,2})[\/\.-](\d{1,2})[\/\.-]?(\d{0,4})/;
    const timeRegex = /(\d{1,2})[:\.](\d{2})\s*[-–—to]+\s*(\d{1,2})[:\.](\d{2})/;
    
    lines.forEach(line => {
      const dateMatch = line.match(dateRegex);
      const timeMatch = line.match(timeRegex);
      
      if (dateMatch && timeMatch) {
        let day = parseInt(dateMatch[1]);
        let month = parseInt(dateMatch[2]) - 1; // JavaScript months are 0-indexed
        let year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();
        if (year < 100) year += 2000; // Convert 2-digit year to 4-digit
        
        const startHour = parseInt(timeMatch[1]);
        const startMinute = parseInt(timeMatch[2]);
        const endHour = parseInt(timeMatch[3]);
        const endMinute = parseInt(timeMatch[4]);
        
        const shiftDate = new Date(year, month, day);
        const startTimeStr = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        shifts.push({
          id: Date.now() + Math.random().toString(),
          date: shiftDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
        });
      }
    });
    
    // Add all parsed shifts
    shifts.forEach(shift => onAddShift(shift));
    
    // Clear import text
    setImportText("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="startTime" className="block text-sm font-medium">
                Start Time
              </label>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          applyTemplate(value);
                        }}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue placeholder="Time template" />
                        </SelectTrigger>
                        <SelectContent>
                          {shiftTemplates.map((template) => (
                            <SelectItem
                              key={template.start}
                              value={template.start}
                            >
                              {template.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="block text-sm font-medium">
              End Time
            </label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1 bg-coop-primary hover:bg-coop-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Shift
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={duplicateLatestShift}
            disabled={shifts.length === 0}
          >
            <Copy className="mr-2 h-4 w-4" /> Duplicate Last
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" /> Batch Add
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Multiple Shifts</SheetTitle>
                <SheetDescription>
                  Select multiple dates and set a time for all shifts
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Select Dates</label>
                  <p className="text-xs text-muted-foreground">
                    Click dates to select/deselect them
                  </p>
                  <Calendar
                    mode="multiple"
                    selected={batchDates}
                    onSelect={setBatchDates}
                    className="rounded-md border w-full"
                  />
                  <div className="text-sm mt-2">
                    {batchDates.length} date(s) selected
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={batchStartTime}
                      onChange={(e) => setBatchStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={batchEndTime}
                      onChange={(e) => setBatchEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleBatchAdd} 
                  className="w-full bg-coop-primary hover:bg-coop-primary/90"
                  disabled={batchDates.length === 0}
                >
                  Add {batchDates.length} Shifts
                </Button>
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Import from Text</label>
                  <p className="text-xs text-muted-foreground">
                    Paste text containing dates and times (e.g., "12/05 15:00-23:00")
                  </p>
                  <textarea
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="12/05 15:00-23:00&#10;13/05 08:00-16:00"
                  />
                </div>
                <Button 
                  onClick={parseTextImport} 
                  className="w-full"
                  disabled={!importText.trim()}
                  variant="outline"
                >
                  Parse & Add Shifts
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </form>
    </div>
  );
};

export default ShiftForm;
