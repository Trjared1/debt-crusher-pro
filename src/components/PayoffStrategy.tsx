import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Loan } from "./LoanCard";

interface PayoffStrategyProps {
  loans: Loan[];
  extraPayment: number;
}

interface PayoffResult {
  strategy: 'avalanche' | 'snowball';
  totalInterest: number;
  timeToPayoff: number; // months
  monthlyPayment: number;
  order: Loan[];
}

export default function PayoffStrategy({ loans, extraPayment }: PayoffStrategyProps) {
  const calculatePayoffStrategy = (strategy: 'avalanche' | 'snowball'): PayoffResult => {
    const sortedLoans = [...loans].sort((a, b) => {
      if (strategy === 'avalanche') {
        return b.interestRate - a.interestRate; // Highest interest first
      } else {
        return a.balance - b.balance; // Lowest balance first
      }
    });

    let totalInterest = 0;
    let totalMonths = 0;
    let totalMinimumPayment = loans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
    let availableExtra = extraPayment;
    
    const workingLoans = sortedLoans.map(loan => ({ ...loan }));
    
    while (workingLoans.some(loan => loan.balance > 0)) {
      totalMonths++;
      
      // Apply minimum payments to all loans
      workingLoans.forEach(loan => {
        if (loan.balance > 0) {
          const monthlyInterest = (loan.balance * loan.interestRate / 100) / 12;
          totalInterest += monthlyInterest;
          const principalPayment = Math.min(loan.minimumPayment - monthlyInterest, loan.balance);
          loan.balance = Math.max(0, loan.balance - principalPayment);
        }
      });
      
      // Apply extra payment to the first loan with balance
      const targetLoan = workingLoans.find(loan => loan.balance > 0);
      if (targetLoan && availableExtra > 0) {
        const extraPrincipal = Math.min(availableExtra, targetLoan.balance);
        targetLoan.balance -= extraPrincipal;
      }
      
      // Safety break to prevent infinite loops
      if (totalMonths > 600) break; // 50 years max
    }

    return {
      strategy,
      totalInterest,
      timeToPayoff: totalMonths,
      monthlyPayment: totalMinimumPayment + extraPayment,
      order: sortedLoans
    };
  };

  const avalanche = calculatePayoffStrategy('avalanche');
  const snowball = calculatePayoffStrategy('snowball');
  
  const betterStrategy = avalanche.totalInterest < snowball.totalInterest ? avalanche : snowball;
  const savings = Math.abs(avalanche.totalInterest - snowball.totalInterest);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-debt" />
            Debt Avalanche
            {betterStrategy.strategy === 'avalanche' && (
              <Badge className="bg-gradient-success text-success-foreground">
                Recommended
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pay highest interest rates first
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-bold text-debt">
                ${avalanche.totalInterest.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time to Pay Off</p>
              <p className="text-xl font-bold flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {Math.floor(avalanche.timeToPayoff / 12)}y {avalanche.timeToPayoff % 12}m
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Payment Order</p>
            <div className="space-y-2">
              {avalanche.order.slice(0, 3).map((loan, index) => (
                <div key={loan.id} className="flex justify-between items-center">
                  <span className="text-sm">{index + 1}. {loan.name}</span>
                  <span className="text-sm font-medium">{loan.interestRate}%</span>
                </div>
              ))}
              {avalanche.order.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{avalanche.order.length - 3} more loans
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            Debt Snowball
            {betterStrategy.strategy === 'snowball' && (
              <Badge className="bg-gradient-success text-success-foreground">
                Recommended
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pay smallest balances first
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-bold text-debt">
                ${snowball.totalInterest.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time to Pay Off</p>
              <p className="text-xl font-bold flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {Math.floor(snowball.timeToPayoff / 12)}y {snowball.timeToPayoff % 12}m
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Payment Order</p>
            <div className="space-y-2">
              {snowball.order.slice(0, 3).map((loan, index) => (
                <div key={loan.id} className="flex justify-between items-center">
                  <span className="text-sm">{index + 1}. {loan.name}</span>
                  <span className="text-sm font-medium">${loan.balance.toLocaleString()}</span>
                </div>
              ))}
              {snowball.order.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{snowball.order.length - 3} more loans
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {savings > 100 && (
        <Card className="lg:col-span-2 bg-gradient-success text-success-foreground border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">
                The {betterStrategy.strategy} method could save you
              </p>
              <p className="text-3xl font-bold">
                ${savings.toLocaleString()}
              </p>
              <p className="text-sm opacity-90 mt-1">
                in total interest payments
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}