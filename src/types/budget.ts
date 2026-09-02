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
  description?: string | null;
  estimatedCost: number;
  finalCost: number;
  paidAmount: number;
  pendingAmount: number;
  percentage: number;
  order: number;
  icon?: string | null;
  color: string;
  budgetId: string;
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date | string;
  categoryId: string;
  vendorId?: string | null;
  notes?: string | null;
  budgetId: string;
  category?: BudgetCategory;
  vendor?: Vendor | null;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  paymentDate: Date | string;
  expenseId?: string | null;
  categoryId?: string | null;
  budgetId: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  dueDate?: Date | string | null;
  notes?: string | null;
  expense?: Expense | null;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  category?: string | null;
  notes?: string | null;
  expenses?: Expense[];
}
