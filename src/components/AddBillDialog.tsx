import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { Bill } from "./BillCard";

interface AddBillDialogProps {
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  editBill?: Bill;
  onEditBill?: (bill: Bill) => void;
}

export default function AddBillDialog({ onAddBill, editBill, onEditBill }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: editBill?.name || '',
    amount: editBill?.amount || 0,
    dueDate: editBill?.dueDate || 1,
    category: editBill?.category || 'utilities' as Bill['category'],
    isRecurring: editBill?.isRecurring ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editBill && onEditBill) {
      onEditBill({
        ...editBill,
        ...formData
      });
    } else {
      onAddBill(formData);
    }
    
    if (!editBill) {
      setFormData({
        name: '',
        amount: 0,
        dueDate: 1,
        category: 'utilities',
        isRecurring: true
      });
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          {editBill ? 'Edit Bill' : 'Add Bill'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editBill ? 'Edit Bill' : 'Add New Bill'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Electric Bill"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  amount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Day of Month)</Label>
              <Input
                id="dueDate"
                type="number"
                min="1"
                max="31"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dueDate: parseInt(e.target.value) || 1 
                }))}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: Bill['category']) => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="subscriptions">Subscriptions</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recurring">Recurring Bill</Label>
              <p className="text-sm text-muted-foreground">
                Bill repeats every month
              </p>
            </div>
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isRecurring: checked }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {editBill ? 'Update Bill' : 'Add Bill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}