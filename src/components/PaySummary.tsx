
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PayCalculation } from "@/utils/payCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PaySummaryProps {
  calculation: PayCalculation | null;
}

const PaySummary: React.FC<PaySummaryProps> = ({ calculation }) => {
  if (!calculation) {
    return null;
  }

  const {
    baseWage,
    allowances,
    totalBeforeTax,
    tax,
    netPay,
    hoursWorked,
    details,
  } = calculation;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-coop-primary text-white">
        <CardTitle>Pay Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Hours Worked</p>
            <p className="text-2xl font-semibold">{hoursWorked.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Pay</p>
            <p className="text-2xl font-semibold text-green-600">
              {formatCurrency(netPay)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Wage</span>
            <span>{formatCurrency(baseWage)}</span>
          </div>
          <div className="flex justify-between">
            <span>Allowances</span>
            <span>{formatCurrency(allowances)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total Before Tax</span>
            <span>{formatCurrency(totalBeforeTax)}</span>
          </div>
          <div className="flex justify-between text-destructive">
            <span>Tax</span>
            <span>- {formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Net Pay</span>
            <span className="text-green-600">{formatCurrency(netPay)}</span>
          </div>
        </div>

        <Separator />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Shift Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {details.map((detail, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="font-medium">{detail.date}</div>
                    <div className="text-sm text-muted-foreground">
                      {detail.hours.toFixed(2)} hours worked
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base Wage</span>
                        <span>{formatCurrency(detail.baseWage)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances</span>
                        <span>{formatCurrency(detail.allowances)}</span>
                      </div>
                      {detail.breakdown.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-muted space-y-1">
                          {detail.breakdown.map((item, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Shift Total</span>
                        <span>{formatCurrency(detail.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PaySummary;
