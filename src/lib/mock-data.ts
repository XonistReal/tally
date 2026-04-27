export const starterLimits = {
  monthlyCashEntries: 25,
  monthlyReceipts: 20,
  activeSplitProjects: 1,
  activePackingTemplates: 1,
};

export const packingTemplates: Record<string, string[]> = {
  business: ["Laptop", "Chargers", "Formal shoes", "Notebook", "ID"],
  beach: ["Swimsuit", "Sunscreen", "Hat", "Sandals", "Water bottle"],
  winter: ["Thermal layers", "Jacket", "Boots", "Gloves", "Moisturizer"],
  family: ["Snacks", "Meds", "Documents", "Kids clothes", "Power bank"],
  custom: [],
};

export const cashCategories = [
  "Food",
  "Groceries",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Travel",
  "Shopping",
  "Other",
];

export const taxTags = [
  "Personal",
  "Tax Deductible",
  "Partially Deductible",
  "Reimbursable",
  "Business Expense",
];
