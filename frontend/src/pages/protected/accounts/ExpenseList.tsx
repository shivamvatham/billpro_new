import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Expense, expenseSchema } from "@/validation/expense.schema";
import { type Account } from "@/validation/account.schema";
import { type ExpenseCategory } from "@/validation/expenseCategory.schema";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
// hello
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDateToDDMMYYYY } from "@/util/dateFormat";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExpenseWithPopulated = Expense & {
  accountType: { _id: string; accountName: string } | string;
  expenseCategory: { _id: string; categoryName: string } | string;
};

const columns: ColumnDef<ExpenseWithPopulated>[] = [
  {
    accessorKey: "expenseName",
    header: "Expense Name",
  },
  {
    accessorKey: "accountType",
    header: "Account",
    cell: ({ row }) => {
      const accountType = row.original.accountType;
      return typeof accountType === 'object' 
        ? (accountType as { _id: string; accountName: string }).accountName 
        : '---';
    },
  },
  {
    accessorKey: "expenseCategory",
    header: "Category",
    cell: ({ row }) => {
      const expenseCategory = row.original.expenseCategory;
      return typeof expenseCategory === 'object' 
        ? (expenseCategory as { _id: string; categoryName: string }).categoryName 
        : '---';
    },
  },
  {
    accessorKey: "expenseAmount",
    header: "Amount",
  },
  {
    accessorKey: "expenseDate",
    header: "Date",
    cell: ({ row }) => formatDateToDDMMYYYY(row.original.expenseDate),
  },
];

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<ExpenseWithPopulated[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithPopulated | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithPopulated | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      expenseName: "",
      accountType: "",
      expenseCategory: "",
      description: "",
      expenseAmount: undefined,
      expenseDate: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, accountsRes, categoriesRes] = await Promise.all([
          axios.get("/expenses"),
          axios.get("/accounts"),
          axios.get("/expensecategories"),
        ]);
        setExpenses(expensesRes.data.expenses);
        setAccounts(accountsRes.data.accounts);
        setCategories(categoriesRes.data.expenseCategories);
        
        if (accountsRes.data.accounts.length > 0 && categoriesRes.data.expenseCategories.length > 0) {
          form.reset({
            expenseName: "",
            accountType: accountsRes.data.accounts[0]._id,
            expenseCategory: categoriesRes.data.expenseCategories[0]._id,
            description: "",
            expenseAmount: undefined,
            expenseDate: "",
          });
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (expense: ExpenseWithPopulated) => {
    setEditingExpense(expense);
    
    const accountId = typeof expense.accountType === 'object' 
      ? (expense.accountType as { _id: string; accountName: string })._id 
      : expense.accountType;
      
    const categoryId = typeof expense.expenseCategory === 'object' 
      ? (expense.expenseCategory as { _id: string; categoryName: string })._id 
      : expense.expenseCategory;
    
    form.reset({
      expenseName: expense.expenseName,
      accountType: accountId,
      expenseCategory: categoryId,
      description: expense.description,
      expenseAmount: expense.expenseAmount,
      expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
    });
  };

  const handleDelete = (expense: ExpenseWithPopulated) => {
    setSelectedExpense(expense);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedExpense) return;
    try {
      await axios.delete(`/expenses/${selectedExpense._id}`);
      const response = await axios.get("/expenses");
      setExpenses(response.data.expenses);
    } catch (error) {
      console.log("Error deleting expense:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedExpense(null);
    }
  };

  const onSubmit = async (data: Expense) => {
    try {
      if (editingExpense) {
        await axios.put(`/expenses/${editingExpense._id}`, data);
      } else {
        await axios.post("/expenses", data);
      }
      const response = await axios.get("/expenses");
      setExpenses(response.data.expenses);
      setEditingExpense(null);
      form.reset({
        expenseName: "",
        accountType: accounts[0]?._id || "",
        expenseCategory: categories[0]?._id || "",
        description: "",
        expenseAmount: undefined,
        expenseDate: "",
      });
    } catch (error) {
      console.log("Error saving expense:", error);
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
    form.reset({
      expenseName: "",
      accountType: accounts[0]?._id || "",
      expenseCategory: categories[0]?._id || "",
      description: "",
      expenseAmount: undefined,
      expenseDate: "",
    });
  };

  const actions: TableAction<ExpenseWithPopulated>[] = [
    {
      label: "",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "ghost",
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      onClick: handleDelete,
      variant: "ghost",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{editingExpense ? "Edit" : "Add"} Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <Controller
                name="expenseName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expenseName">Expense Name</FieldLabel>
                    <Input
                      {...field}
                      id="expenseName"
                      placeholder="Enter expense name"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="accountType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Account</FieldLabel>
                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {accounts.map((account) => (
                            <SelectItem key={account._id!} value={account._id!}>
                              {account.accountName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="expenseCategory"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Expense Category</FieldLabel>
                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category._id!} value={category._id!}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="expenseAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expenseAmount">Amount</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ''}
                      id="expenseAmount"
                      type="number"
                      placeholder="Enter amount"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="expenseDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Date</FieldLabel>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString().split('T')[0]);
                            setDatePickerOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Enter description (optional)"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="min-w-32"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    editingExpense ? "Update" : "Create"
                  )}
                </Button>
                {editingExpense && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={expenses}
              searchKey="expenseName"
              enableSorting
              actions={actions}
            />
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete ${selectedExpense?.expenseName}? This action cannot be undone.`}
      />
    </>
  );
}
