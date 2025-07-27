import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Calendar } from "lucide-react";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month (1-31)
  category: 'housing' | 'utilities' | 'insurance' | 'subscriptions' | 'other';
  isRecurring: boolean;
}

interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
}

export default function BillCard({ bill, onEdit, onDelete }: BillCardProps) {
  const getCategoryColor = (category: Bill['category']) => {
    switch (category) {
      case 'housing': return 'bg-primary text-primary-foreground';
      case 'utilities': return 'bg-warning text-warning-foreground';
      case 'insurance': return 'bg-accent text-accent-foreground';
      case 'subscriptions': return 'bg-success text-success-foreground';
      case 'other': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let dueThisMonth = new Date(currentYear, currentMonth, bill.dueDate);
    
    if (dueThisMonth < today) {
      dueThisMonth = new Date(currentYear, currentMonth + 1, bill.dueDate);
    }
    
    const diffTime = dueThisMonth.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <Card className="bg-gradient-card border-border shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{bill.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={`text-xs ${getCategoryColor(bill.category)}`}>
              {bill.category.toUpperCase()}
            </Badge>
            {bill.isRecurring && (
              <Badge variant="outline" className="text-xs">
                RECURRING
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(bill)}
            className="h-8 w-8 hover:bg-accent"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(bill.id)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold">
              ${bill.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="text-xl font-semibold flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {bill.dueDate}
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            {isOverdue ? (
              <Badge className="bg-gradient-debt text-debt-foreground">
                Overdue
              </Badge>
            ) : isDueSoon ? (
              <Badge className="bg-warning text-warning-foreground">
                Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
              </Badge>
            ) : (
              <Badge className="bg-success text-success-foreground">
                {daysUntilDue} days remaining
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}