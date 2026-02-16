import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type ProductCategory, productCategorySchema } from "@/validation/productCategory.schema";
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

const columns: ColumnDef<ProductCategory>[] = [
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

export default function ProductCategoryList() {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const form = useForm<ProductCategory>({
    resolver: zodResolver(productCategorySchema),
    mode: "onChange",
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
    },
  });

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    form.reset(category);
  };

  const handleDelete = (category: ProductCategory) => {
    setSelectedCategory(category);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(`/productcategories/${selectedCategory._id}`);
      const response = await axios.get("/productcategories");
      setProductCategories(response.data.productCategories);
    } catch (error) {
      console.log("Error deleting product category:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedCategory(null);
    }
  };

  const onSubmit = async (data: ProductCategory) => {
    try {
      if (editingCategory) {
        await axios.put(`/productcategories/${editingCategory._id}`, data);
      } else {
        await axios.post("/productcategories", data);
      }
      const response = await axios.get("/productcategories");
      setProductCategories(response.data.productCategories);
      setEditingCategory(null);
      form.reset();
    } catch (error) {
      console.log("Error saving product category:", error);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    form.reset();
  };

  const actions: TableAction<ProductCategory>[] = [
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

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get("/productcategories");
        setProductCategories(response.data.productCategories);
      } catch (error) {
        console.log("Error fetching product categories:", error);
      }
    };
    fetchProductCategories();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit" : "Add"} Product Category</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={productCategories}
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
        title="Delete Product Category"
        description={`Are you sure you want to delete ${selectedCategory?.categoryName}? This action cannot be undone.`}
      />
    </>
  );
}
