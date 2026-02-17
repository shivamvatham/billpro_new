import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type ExpenseCategory, expenseCategorySchema } from "@/validation/expenseCategory.schema";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";

const columns: ColumnDef<ExpenseCategory>[] = [
  {
    accessorKey: "categoryName",
    header: "Category Name",
  },
  {
    accessorKey: "categoryDescription",
    header: "Description",
    cell: ({ row }) => row.original.categoryDescription || "---",
  },
];

export default function ExpenseCategoryList() {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

  const form = useForm<ExpenseCategory>({
    resolver: zodResolver(expenseCategorySchema),
    mode: "onChange",
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
    },
  });

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const response = await axios.get("/expensecategories");
        setExpenseCategories(response.data.expenseCategories);
      } catch (error) {
        console.log("Error fetching expense categories:", error);
      }
    };
    fetchExpenseCategories();
  }, []);

  const handleEdit = (category: ExpenseCategory) => {
    setEditingCategory(category);
    form.reset(category);
  };

  const handleDelete = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(`/expensecategories/${selectedCategory._id}`);
      const response = await axios.get("/expensecategories");
      setExpenseCategories(response.data.expenseCategories);
    } catch (error) {
      console.log("Error deleting expense category:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedCategory(null);
    }
  };

  const onSubmit = async (data: ExpenseCategory) => {
    try {
      if (editingCategory) {
        await axios.put(`/expensecategories/${editingCategory._id}`, data);
      } else {
        await axios.post("/expensecategories", data);
      }
      const response = await axios.get("/expensecategories");
      setExpenseCategories(response.data.expenseCategories);
      setEditingCategory(null);
      form.reset({ categoryName: "", categoryDescription: "" });
    } catch (error) {
      console.log("Error saving expense category:", error);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    form.reset({ categoryName: "", categoryDescription: "" });
  };

  const actions: TableAction<ExpenseCategory>[] = [
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
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <Card className="w-full lg:w-96">
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit" : "Add"} Expense Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="categoryName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                    <Input
                      {...field}
                      id="categoryName"
                      placeholder="Enter category name"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="categoryDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="categoryDescription">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="categoryDescription"
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
                    editingCategory ? "Update" : "Create"
                  )}
                </Button>
                {editingCategory && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="w-full lg:flex-1">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={expenseCategories}
              searchKey="categoryName"
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
        title="Delete Expense Category"
        description={`Are you sure you want to delete ${selectedCategory?.categoryName}? This action cannot be undone.`}
      />
    </>
  );
}
