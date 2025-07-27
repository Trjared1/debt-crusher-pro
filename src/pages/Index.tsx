import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, CreditCard, Receipt, Calculator, PiggyBank } from "lucide-react";

import LoanCard, { Loan } from "@/components/LoanCard";
import BillCard, { Bill } from "@/components/BillCard";
import AddLoanDialog from "@/components/AddLoanDialog";
import AddBillDialog from "@/components/AddBillDialog";
import FinancialSummary from "@/components/FinancialSummary";
import PayoffStrategy from "@/components/PayoffStrategy";
import PaymentSlider from "@/components/PaymentSlider";

const Index = () => {
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      name: 'Chase Freedom Card',
      balance: 5500,
      originalBalance: 8000,
      interestRate: 22.99,
      minimumPayment: 165,
      type: 'credit-card'
    },
    {
      id: '2',
      name: 'Personal Loan',
      balance: 12000,
      originalBalance: 15000,
      interestRate: 8.5,
      minimumPayment: 275,
      type: 'personal'
    },
    {
      id: '3',
      name: 'Student Loan',
      balance: 25000,
      originalBalance: 30000,
      interestRate: 4.2,
      minimumPayment: 320,
      type: 'student'
    }
  ]);

  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      name: 'Rent',
      amount: 1200,
      dueDate: 1,
      category: 'housing',
      isRecurring: true
    },
    {
      id: '2',
      name: 'Electric Bill',
      amount: 120,
      dueDate: 15,
      category: 'utilities',
      isRecurring: true
    },
    {
      id: '3',
      name: 'Netflix',
      amount: 15.99,
      dueDate: 8,
      category: 'subscriptions',
      isRecurring: true
    },
    {
      id: '4',
      name: 'Car Insurance',
      amount: 180,
      dueDate: 20,
      category: 'insurance',
      isRecurring: true
    }
  ]);

  const [editingLoan, setEditingLoan] = useState<Loan | undefined>(undefined);
  const [editingBill, setBill] = useState<Bill | undefined>(undefined);

  const handleAddLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString()
    };
    setLoans(prev => [...prev, newLoan]);
    toast({
      title: "Loan Added",
      description: `${loanData.name} has been added to your loans.`
    });
  };

  const handleEditLoan = (updatedLoan: Loan) => {
    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
    setEditingLoan(undefined);
    toast({
      title: "Loan Updated",
      description: `${updatedLoan.name} has been updated.`
    });
  };

  const handleDeleteLoan = (id: string) => {
    const loan = loans.find(l => l.id === id);
    setLoans(prev => prev.filter(loan => loan.id !== id));
    toast({
      title: "Loan Deleted",
      description: `${loan?.name} has been removed from your loans.`
    });
  };

  const handleAddBill = (billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString()
    };
    setBills(prev => [...prev, newBill]);
    toast({
      title: "Bill Added",
      description: `${billData.name} has been added to your bills.`
    });
  };

  const handleEditBill = (updatedBill: Bill) => {
    setBills(prev => prev.map(bill => 
      bill.id === updatedBill.id ? updatedBill : bill
    ));
    setBill(undefined);
    toast({
      title: "Bill Updated",
      description: `${updatedBill.name} has been updated.`
    });
  };

  const handleDeleteBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    setBills(prev => prev.filter(bill => bill.id !== id));
    toast({
      title: "Bill Deleted",
      description: `${bill?.name} has been removed from your bills.`
    });
  };

  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-full shadow-glow">
            <PiggyBank className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Financial Tracker</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your loans and bills, discover the fastest payoff strategies, and visualize your path to financial freedom.
          </p>
        </div>

        {/* Financial Summary */}
        <FinancialSummary loans={loans} bills={bills} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="loans" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Loans
            </TabsTrigger>
            <TabsTrigger value="bills" className="gap-2">
              <Receipt className="h-4 w-4" />
              Bills
            </TabsTrigger>
            <TabsTrigger value="strategies" className="gap-2">
              <Calculator className="h-4 w-4" />
              Strategies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <Card className="bg-gradient-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <AddLoanDialog onAddLoan={handleAddLoan} />
                    <AddBillDialog onAddBill={handleAddBill} />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Loans</p>
                      <p className="text-2xl font-bold">{loans.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Bills</p>
                      <p className="text-2xl font-bold">{bills.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Simulator */}
              <PaymentSlider loans={loans} monthlyBills={totalBills} />
            </div>

            {/* Recent Loans */}
            {loans.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Your Loans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loans.slice(0, 3).map((loan) => (
                    <LoanCard
                      key={loan.id}
                      loan={loan}
                      onEdit={setEditingLoan}
                      onDelete={handleDeleteLoan}
                    />
                  ))}
                </div>
                {loans.length > 3 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => {
                      const tabsEl = document.querySelector('[data-state="inactive"][value="loans"]') as HTMLElement;
                      tabsEl?.click();
                    }}>
                      View All {loans.length} Loans
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Loans</h2>
                <p className="text-muted-foreground">Manage and track all your loans</p>
              </div>
              <AddLoanDialog 
                onAddLoan={handleAddLoan}
                editLoan={editingLoan}
                onEditLoan={handleEditLoan}
              />
            </div>

            {loans.length === 0 ? (
              <Card className="bg-gradient-card border-border shadow-medium">
                <CardContent className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No loans added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first loan to start tracking your debt payoff journey.</p>
                  <AddLoanDialog onAddLoan={handleAddLoan} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onEdit={setEditingLoan}
                    onDelete={handleDeleteLoan}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bills" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Monthly Bills</h2>
                <p className="text-muted-foreground">Track your recurring expenses</p>
              </div>
              <AddBillDialog 
                onAddBill={handleAddBill}
                editBill={editingBill}
                onEditBill={handleEditBill}
              />
            </div>

            {bills.length === 0 ? (
              <Card className="bg-gradient-card border-border shadow-medium">
                <CardContent className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bills added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your monthly bills to get a complete picture of your expenses.</p>
                  <AddBillDialog onAddBill={handleAddBill} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onEdit={setBill}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategies" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Debt Payoff Strategies</h2>
              <p className="text-muted-foreground">Compare different approaches to paying off your debt</p>
            </div>

            {loans.length === 0 ? (
              <Card className="bg-gradient-card border-border shadow-medium">
                <CardContent className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Add loans to see strategies</h3>
                  <p className="text-muted-foreground mb-4">Add your loans first to compare debt payoff strategies.</p>
                  <AddLoanDialog onAddLoan={handleAddLoan} />
                </CardContent>
              </Card>
            ) : (
              <PayoffStrategy loans={loans} extraPayment={0} />
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog Handlers */}
        {editingLoan && (
          <AddLoanDialog
            editLoan={editingLoan}
            onEditLoan={handleEditLoan}
            onAddLoan={() => {}}
          />
        )}
        
        {editingBill && (
          <AddBillDialog
            editBill={editingBill}
            onEditBill={handleEditBill}
            onAddBill={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
