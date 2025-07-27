import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Receipt } from "lucide-react";
import { Loan } from "./LoanCard";
import { Bill } from "./BillCard";

interface FinancialSummaryProps {
  loans: Loan[];
  bills: Bill[];
}

export default function FinancialSummary({ loans, bills }: FinancialSummaryProps) {
  const totalDebt = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalOriginalDebt = loans.reduce((sum, loan) => sum + loan.originalBalance, 0);
  const totalMinimumPayments = loans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalMonthlyExpenses = totalMinimumPayments + totalBills;
  
  const debtProgress = totalOriginalDebt > 0 ? ((totalOriginalDebt - totalDebt) / totalOriginalDebt) * 100 : 0;
  const monthlyInterest = loans.reduce((sum, loan) => sum + ((loan.balance * loan.interestRate / 100) / 12), 0);
  
  const averageInterestRate = totalDebt > 0 
    ? loans.reduce((sum, loan) => sum + (loan.interestRate * loan.balance), 0) / totalDebt 
    : 0;

  const highestInterestLoan = loans.reduce((highest, loan) => 
    loan.interestRate > highest.interestRate ? loan : highest, 
    loans[0] || { name: 'None', interestRate: 0 }
  );

  const smallestBalanceLoan = loans.reduce((smallest, loan) => 
    loan.balance < smallest.balance ? loan : smallest,
    loans[0] || { name: 'None', balance: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Debt */}
      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
          <CreditCard className="h-4 w-4 text-debt" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-debt">
            ${totalDebt.toLocaleString()}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{debtProgress.toFixed(1)}%</span>
            </div>
            <Progress value={debtProgress} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ${(totalOriginalDebt - totalDebt).toLocaleString()} paid off
          </p>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <Receipt className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalMonthlyExpenses.toLocaleString()}
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Loan payments</span>
              <span className="font-medium">${totalMinimumPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Bills</span>
              <span className="font-medium">${totalBills.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Interest */}
      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Interest</CardTitle>
          <TrendingUp className="h-4 w-4 text-debt" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-debt">
            ${monthlyInterest.toFixed(0)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Avg rate: {averageInterestRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">
            ${(monthlyInterest * 12).toFixed(0)} per year
          </p>
        </CardContent>
      </Card>

      {/* Payoff Priority */}
      <Card className="bg-gradient-card border-border shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Focus</CardTitle>
          <DollarSign className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Highest Interest</p>
              <p className="text-sm font-semibold text-debt">
                {highestInterestLoan.name} ({highestInterestLoan.interestRate}%)
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Smallest Balance</p>
              <p className="text-sm font-semibold text-success">
                {smallestBalanceLoan.name} (${smallestBalanceLoan.balance?.toLocaleString()})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}