// types/budget.ts
export interface Budget {
  id: string;
  totalBudget: number;
  finalCost: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  categories: BudgetCategory[];
  expenses: Expense[];
  payments: Payment[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  estimatedCost: number;
  finalCost: number;
  paidAmount: number;
  pendingAmount: number;
  percentage: number;
  order: number;
  icon?: string;
  color: string;
  budgetId: string;
  expenses: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  vendorId?: string;
  notes?: string;
  budgetId: string;
  category?: BudgetCategory;
  vendor?: Vendor;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  expenseId?: string;
  categoryId?: string;
  budgetId: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  dueDate?: Date;
  notes?: string;
  expense?: Expense;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  notes?: string;
  expenses: Expense[];
}