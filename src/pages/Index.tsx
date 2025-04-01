
import React, { useState } from "react";
import { WorkShift, calculateTotalPay, PayCalculation } from "@/utils/payCalculator";
import ShiftForm from "@/components/ShiftForm";
import ShiftList from "@/components/ShiftList";
import PaySummary from "@/components/PaySummary";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Percent } from "lucide-react";

const Index = () => {
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [taxPercentage, setTaxPercentage] = useState<number>(35);
  const [calculation, setCalculation] = useState<PayCalculation | null>(null);

  const handleAddShift = (shift: WorkShift) => {
    const updatedShifts = [...shifts, shift];
    setShifts(updatedShifts);
    updateCalculation(updatedShifts, taxPercentage);
  };

  const handleDeleteShift = (id: string) => {
    const updatedShifts = shifts.filter((shift) => shift.id !== id);
    setShifts(updatedShifts);
    updateCalculation(updatedShifts, taxPercentage);
  };

  const handleTaxChange = (value: number[]) => {
    const newTaxPercentage = value[0];
    setTaxPercentage(newTaxPercentage);
    updateCalculation(shifts, newTaxPercentage);
  };

  const updateCalculation = (
    currentShifts: WorkShift[],
    currentTaxPercentage: number
  ) => {
    if (currentShifts.length > 0) {
      const result = calculateTotalPay(currentShifts, currentTaxPercentage);
      setCalculation(result);
    } else {
      setCalculation(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-coop-primary">Coop Extra Pay Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate your monthly pay based on shifts worked at Coop Extra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Your Shifts</CardTitle>
              </CardHeader>
              <CardContent>
                <ShiftForm onAddShift={handleAddShift} shifts={shifts} />
              </CardContent>
            </Card>

            <ShiftList shifts={shifts} onDeleteShift={handleDeleteShift} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tax">Tax Percentage</Label>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Percent className="h-3 w-3" />
                      <span>{taxPercentage}</span>
                    </div>
                  </div>
                  <Slider
                    id="tax"
                    min={0}
                    max={50}
                    step={1}
                    defaultValue={[taxPercentage]}
                    onValueChange={handleTaxChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {calculation && <PaySummary calculation={calculation} />}
          </div>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Base wage: 177.53 NOK per hour. Additional allowances apply for
            evenings, weekends, and Sundays.
          </p>
          <p className="mt-1">
            This calculator is based on the 2024 Retail Wage Agreement (HK/Virke).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
