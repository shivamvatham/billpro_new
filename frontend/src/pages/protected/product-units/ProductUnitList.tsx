import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type ProductUnit, productUnitSchema } from "@/validation/productUnit.schema";
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

const columns: ColumnDef<ProductUnit>[] = [
  {
    accessorKey: "unitName",
    header: "Unit Name",
  },
  {
    accessorKey: "unitDescription",
    header: "Description",
    cell: ({ row }) => row.original.unitDescription || "---",
  },
];

export default function ProductUnitList() {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit | null>(null);
  const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);

  const form = useForm<ProductUnit>({
    resolver: zodResolver(productUnitSchema),
    mode: "onChange",
    defaultValues: {
      unitName: "",
      unitDescription: "",
    },
  });

  const handleEdit = (unit: ProductUnit) => {
    setEditingUnit(unit);
    form.reset(unit);
  };



  const handleDelete = (unit: ProductUnit) => {
    setSelectedUnit(unit);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUnit) return;
    try {
      await axios.delete(`/productunits/${selectedUnit._id}`);
      const response = await axios.get("/productunits");
      setProductUnits(response.data.productUnits);
    } catch (error) {
      console.log("Error deleting product unit:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedUnit(null);
    }
  };

  const onSubmit = async (data: ProductUnit) => {
    try {
      if (editingUnit) {
        await axios.put(`/productunits/${editingUnit._id}`, data);
      } else {
        await axios.post("/productunits", data);
      }
      const response = await axios.get("/productunits");
      setProductUnits(response.data.productUnits);
      setEditingUnit(null);
      form.reset();
    } catch (error) {
      console.log("Error saving product unit:", error);
    }
  };

  const handleCancel = () => {
    setEditingUnit(null);
    form.reset();
  };

  const actions: TableAction<ProductUnit>[] = [
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
    const fetchProductUnits = async () => {
      try {
        const response = await axios.get("/productunits");
        setProductUnits(response.data.productUnits);
      } catch (error) {
        console.log("Error fetching product units:", error);
      }
    };
    fetchProductUnits();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card>
          <CardHeader>
            <CardTitle>{editingUnit ? "Edit" : "Add"} Product Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="unitName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="unitName">Unit Name</FieldLabel>
                    <Input
                      {...field}
                      id="unitName"
                      placeholder="Enter unit name"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="unitDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="unitDescription">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="unitDescription"
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
                    editingUnit ? "Update" : "Create"
                  )}
                </Button>
                {editingUnit && (
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
            <CardTitle>Product Units</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={productUnits}
              searchKey="unitName"
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
        title="Delete Product Unit"
        description={`Are you sure you want to delete ${selectedUnit?.unitName}? This action cannot be undone.`}
      />
    </>
  );
}
