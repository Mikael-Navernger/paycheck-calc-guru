
// Base hourly wage
export const BASE_HOURLY_WAGE = 177.53;

// Allowance rates based on time periods
export const ALLOWANCES = {
  weekdayAfter18: 22,
  weekdayAfter21: 45,
  saturdayAfter13: 45,
  saturdayAfter15: 55,
  saturdayAfter18: 110,
  sunday: 115,
};

export interface WorkShift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export interface PayCalculation {
  baseWage: number;
  allowances: number;
  totalBeforeTax: number;
  tax: number;
  netPay: number;
  hoursWorked: number;
  details: {
    date: string;
    hours: number;
    baseWage: number;
    allowances: number;
    total: number;
    breakdown: string[];
  }[];
}

// Helper to parse a time string like "16:00" into hours and minutes
const parseTime = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
};

// Get the time in hours (e.g., 16.5 for 16:30)
const getTimeInHours = (timeString: string): number => {
  const { hours, minutes } = parseTime(timeString);
  return hours + minutes / 60;
};

// Calculate allowance for a specific day and time period
const calculateAllowanceForTimePeriod = (
  date: Date,
  startTime: string,
  endTime: string
): { hours: number; allowance: number; breakdown: string[] } => {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const startHour = getTimeInHours(startTime);
  const endHour = getTimeInHours(endTime);
  let totalAllowance = 0;
  const breakdownDetails: string[] = [];
  
  // For tracking different time periods
  const periods: { start: number; end: number; allowance: number; label: string }[] = [];
  
  // Sunday - flat rate for the entire day
  if (day === 0) {
    const hoursWorked = endHour - startHour;
    totalAllowance = hoursWorked * ALLOWANCES.sunday;
    breakdownDetails.push(`Sunday allowance: ${hoursWorked.toFixed(2)} hours × ${ALLOWANCES.sunday} NOK = ${totalAllowance.toFixed(2)} NOK`);
    return { hours: hoursWorked, allowance: totalAllowance, breakdown: breakdownDetails };
  }
  
  // Saturday
  if (day === 6) {
    // Before 13:00 - no allowance
    if (startHour < 13) {
      periods.push({ 
        start: startHour, 
        end: Math.min(endHour, 13), 
        allowance: 0,
        label: "Regular (before 13:00)"
      });
    }
    
    // 13:00 to 15:00
    if (startHour < 15 && endHour > 13) {
      periods.push({ 
        start: Math.max(startHour, 13), 
        end: Math.min(endHour, 15), 
        allowance: ALLOWANCES.saturdayAfter13,
        label: "Saturday (13:00-15:00)"
      });
    }
    
    // 15:00 to 18:00
    if (startHour < 18 && endHour > 15) {
      periods.push({ 
        start: Math.max(startHour, 15), 
        end: Math.min(endHour, 18), 
        allowance: ALLOWANCES.saturdayAfter15,
        label: "Saturday (15:00-18:00)"
      });
    }
    
    // After 18:00
    if (endHour > 18) {
      periods.push({ 
        start: Math.max(startHour, 18), 
        end: endHour, 
        allowance: ALLOWANCES.saturdayAfter18,
        label: "Saturday (after 18:00)"
      });
    }
  } 
  // Weekdays (Monday to Friday)
  else if (day >= 1 && day <= 5) {
    // Before 18:00 - no allowance
    if (startHour < 18) {
      periods.push({ 
        start: startHour, 
        end: Math.min(endHour, 18), 
        allowance: 0,
        label: "Regular (before 18:00)"
      });
    }
    
    // 18:00 to 21:00
    if (startHour < 21 && endHour > 18) {
      periods.push({ 
        start: Math.max(startHour, 18), 
        end: Math.min(endHour, 21), 
        allowance: ALLOWANCES.weekdayAfter18,
        label: "Weekday (18:00-21:00)"
      });
    }
    
    // After 21:00
    if (endHour > 21) {
      periods.push({ 
        start: Math.max(startHour, 21), 
        end: endHour, 
        allowance: ALLOWANCES.weekdayAfter21,
        label: "Weekday (after 21:00)"
      });
    }
  }
  
  // Calculate total allowance from all periods
  let totalHours = 0;
  for (const period of periods) {
    const hours = period.end - period.start;
    totalHours += hours;
    
    const periodAllowance = hours * period.allowance;
    totalAllowance += periodAllowance;
    
    if (period.allowance > 0) {
      breakdownDetails.push(
        `${period.label}: ${hours.toFixed(2)} hours × ${period.allowance} NOK = ${periodAllowance.toFixed(2)} NOK`
      );
    }
  }
  
  return { hours: totalHours, allowance: totalAllowance, breakdown: breakdownDetails };
};

// Calculate total pay for all shifts
export const calculateTotalPay = (
  shifts: WorkShift[],
  taxPercentage: number
): PayCalculation => {
  let totalBaseWage = 0;
  let totalAllowances = 0;
  let totalHoursWorked = 0;
  const details: PayCalculation['details'] = [];

  for (const shift of shifts) {
    const { date, startTime, endTime } = shift;
    const { hours, allowance, breakdown } = calculateAllowanceForTimePeriod(
      date,
      startTime,
      endTime
    );

    // Calculate base wage for this shift
    const baseWageForShift = hours * BASE_HOURLY_WAGE;
    
    totalHoursWorked += hours;
    totalBaseWage += baseWageForShift;
    totalAllowances += allowance;

    // Format date for display
    const formattedDate = date.toLocaleDateString('no-NO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    details.push({
      date: formattedDate,
      hours,
      baseWage: baseWageForShift,
      allowances: allowance,
      total: baseWageForShift + allowance,
      breakdown,
    });
  }

  const totalBeforeTax = totalBaseWage + totalAllowances;
  const tax = (totalBeforeTax * taxPercentage) / 100;
  const netPay = totalBeforeTax - tax;

  return {
    baseWage: totalBaseWage,
    allowances: totalAllowances,
    totalBeforeTax,
    tax,
    netPay,
    hoursWorked: totalHoursWorked,
    details,
  };
};
