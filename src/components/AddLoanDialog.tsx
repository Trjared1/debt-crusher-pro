import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Loan } from "./LoanCard";

interface AddLoanDialogProps {
  onAddLoan: (loan: Omit<Loan, 'id'>) => void;
  editLoan?: Loan;
  onEditLoan?: (loan: Loan) => void;
}

export default function AddLoanDialog({ onAddLoan, editLoan, onEditLoan }: AddLoanDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: editLoan?.name || '',
    balance: editLoan?.balance || 0,
    originalBalance: editLoan?.originalBalance || 0,
    interestRate: editLoan?.interestRate || 0,
    minimumPayment: editLoan?.minimumPayment || 0,
    type: editLoan?.type || 'credit-card' as Loan['type']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editLoan && onEditLoan) {
      onEditLoan({
        ...editLoan,
        ...formData
      });
    } else {
      onAddLoan(formData);
    }
    
    if (!editLoan) {
      setFormData({
        name: '',
        balance: 0,
        originalBalance: 0,
        interestRate: 0,
        minimumPayment: 0,
        type: 'credit-card'
      });
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          {editLoan ? 'Edit Loan' : 'Add Loan'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editLoan ? 'Edit Loan' : 'Add New Loan'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Chase Freedom Card"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  balance: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalBalance">Original Balance</Label>
              <Input
                id="originalBalance"
                type="number"
                step="0.01"
                value={formData.originalBalance}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  originalBalance: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  interestRate: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumPayment">Minimum Payment</Label>
              <Input
                id="minimumPayment"
                type="number"
                step="0.01"
                value={formData.minimumPayment}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  minimumPayment: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loan Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: Loan['type']) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="auto">Auto Loan</SelectItem>
                <SelectItem value="student">Student Loan</SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editLoan ? 'Update Loan' : 'Add Loan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}