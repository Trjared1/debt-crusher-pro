import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Edit } from "lucide-react";

export interface Loan {
  id: string;
  name: string;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit-card' | 'personal' | 'auto' | 'student' | 'mortgage';
}

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
}

export default function LoanCard({ loan, onEdit, onDelete }: LoanCardProps) {
  const progressPercentage = ((loan.originalBalance - loan.balance) / loan.originalBalance) * 100;
  
  const getTypeColor = (type: Loan['type']) => {
    switch (type) {
      case 'credit-card': return 'bg-gradient-debt text-debt-foreground';
      case 'personal': return 'bg-gradient-primary text-primary-foreground';
      case 'auto': return 'bg-gradient-accent text-accent-foreground';
      case 'student': return 'bg-warning text-warning-foreground';
      case 'mortgage': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{loan.name}</CardTitle>
          <Badge className={`text-xs ${getTypeColor(loan.type)}`}>
            {loan.type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(loan)}
            className="h-8 w-8 hover:bg-accent"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(loan.id)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold text-debt">
              ${loan.balance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest Rate</p>
            <p className="text-xl font-semibold">{loan.interestRate}%</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage.toFixed(1)}% paid off</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-muted"
          />
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Minimum Payment</p>
            <p className="font-semibold">${loan.minimumPayment.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Monthly Interest</p>
            <p className="font-semibold text-debt">
              ${((loan.balance * loan.interestRate / 100) / 12).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}