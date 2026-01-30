export interface FinanceEntry {
    id: string;
    amount: number;
    type: "income" | "expense";
    date: string;
    category: string;
    description?: string;
}
