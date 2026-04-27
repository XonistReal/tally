export type Tier = "starter" | "pro" | "pro_plus";

export type PurchaseOutcome = "Safe" | "Caution" | "NotRecommended";

export type CashEntry = {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  note?: string;
};

export type SplitMember = {
  id: string;
  name: string;
  weight: number;
  paid: boolean;
};

export type SplitMethod = "equal" | "weighted" | "percentage";

export type SplitProject = {
  id: string;
  title: string;
  total: number;
  method: SplitMethod;
  members: SplitMember[];
  createdAt: string;
};

export type TripType = "business" | "beach" | "winter" | "family" | "custom";

export type PackingItem = {
  id: string;
  name: string;
  packed: boolean;
};

export type PackingList = {
  id: string;
  name: string;
  tripType: TripType;
  items: PackingItem[];
  createdAt: string;
};

export type ReceiptRecord = {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  taxTag: string;
  imageDataUrl?: string;
  note?: string;
};

export type TravelWatch = {
  id: string;
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  flexibilityDays: number;
  maxBudget: number;
  createdAt: string;
};

export type BudgetContext = {
  monthlyIncome: number;
  monthlyBills: number;
  savingsFloor: number;
};
