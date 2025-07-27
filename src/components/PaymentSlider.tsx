import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";
import { Loan } from "./LoanCard";
import { useState } from "react";

interface PaymentSliderProps {
  loans: Loan[];
  monthlyBills: number;
}

export default function PaymentSlider({ loans, monthlyBills }: PaymentSliderProps) {
  const totalMinimumPayment = loans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
  const totalDebt = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const maxExtraPayment = Math.min(5000, totalMinimumPayment * 3); // Cap at $5000 or 3x minimum
  
  const [extraPayment, setExtraPayment] = useState([0]);

  const calculatePayoffTime = (extra: number) => {
    const totalPayment = totalMinimumPayment + extra;
    const avgInterestRate = loans.length > 0 
      ? loans.reduce((sum, loan) => sum + (loan.interestRate * loan.balance), 0) / totalDebt 
      : 0;
    
    if (totalPayment <= (totalDebt * avgInterestRate / 100 / 12)) {
      return { months: 999, totalInterest: 999999 }; // Never pays off
    }
    
    let remainingDebt = totalDebt;
    let months = 0;
    let totalInterest = 0;
    
    while (remainingDebt > 0 && months < 600) { // 50 year cap
      const monthlyInterest = (remainingDebt * avgInterestRate / 100) / 12;
      totalInterest += monthlyInterest;
      const principalPayment = Math.min(totalPayment - monthlyInterest, remainingDebt);
      remainingDebt -= principalPayment;
      months++;
    }
    
    return { months, totalInterest };
  };

  const currentResult = calculatePayoffTime(extraPayment[0]);
  const baselineResult = calculatePayoffTime(0);
  
  const timeSaved = baselineResult.months - currentResult.months;
  const interestSaved = baselineResult.totalInterest - currentResult.totalInterest;

  return (
    <Card className="bg-gradient-card border-border shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Payment Allocation Simulator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          See how extra payments accelerate your debt freedom
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Extra Monthly Payment</label>
            <Badge variant="outline" className="text-sm">
              ${extraPayment[0].toLocaleString()}
            </Badge>
          </div>
          
          <Slider
            value={extraPayment}
            onValueChange={setExtraPayment}
            max={maxExtraPayment}
            step={50}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>${maxExtraPayment.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Payment</p>
              <p className="text-2xl font-bold">
                ${(totalMinimumPayment + extraPayment[0]).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Minimum: ${totalMinimumPayment.toLocaleString()}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Including Bills</p>
              <p className="text-lg font-semibold text-debt">
                ${(totalMinimumPayment + extraPayment[0] + monthlyBills).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Time to Pay Off
              </p>
              <p className="text-2xl font-bold">
                {currentResult.months < 999 
                  ? `${Math.floor(currentResult.months / 12)}y ${currentResult.months % 12}m`
                  : "Never"
                }
              </p>
              {timeSaved > 0 && (
                <p className="text-xs text-success font-medium">
                  {timeSaved} months faster!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" />
              Total Interest
            </p>
            <p className="text-xl font-bold text-debt">
              ${currentResult.totalInterest.toLocaleString()}
            </p>
            {interestSaved > 0 && (
              <p className="text-xs text-success font-medium">
                Save ${interestSaved.toLocaleString()}!
              </p>
            )}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Debt Free Date
            </p>
            <p className="text-sm font-semibold">
              {currentResult.months < 999 
                ? new Date(Date.now() + currentResult.months * 30 * 24 * 60 * 60 * 1000)
                    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : "Never"
              }
            </p>
          </div>
        </div>

        {extraPayment[0] > 0 && (
          <div className="pt-4 border-t">
            <Card className="bg-gradient-success text-success-foreground border-0">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="font-semibold">
                    With ${extraPayment[0].toLocaleString()} extra per month:
                  </p>
                  <div className="flex justify-center gap-6 mt-2 text-sm">
                    <div>
                      <p className="font-bold">{timeSaved}</p>
                      <p className="opacity-90">months saved</p>
                    </div>
                    <div>
                      <p className="font-bold">${interestSaved.toLocaleString()}</p>
                      <p className="opacity-90">interest saved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}