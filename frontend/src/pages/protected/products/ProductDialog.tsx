import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { productSchema, type Product } from "@/validation/product.schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import type { ProductUnit } from "@/validation/productUnit.schema";
import type { ProductCategory } from "@/validation/productCategory.schema";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function ProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [taxConfig, setTaxConfig] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange" as const,
    defaultValues: {
      productName: "",
      hsnCode: "",
      price: 0,
      unit: "",
      category: "",
      productTax: {
        tax1Rate: undefined as number | undefined,
        tax2Rate: undefined as number | undefined,
        tax3Rate: undefined as number | undefined,
      },
      quantity: undefined as number | undefined,
      reorder: undefined as number | undefined,
      barcodeNumber: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.productName,
        hsnCode: product.hsnCode || "",
        price: product.price || 0,
        unit: (product.unit as any)?._id || product.unit,
        category: (product.category as any)?._id || product.category,
        productTax: product.productTax || { tax1Rate: undefined, tax2Rate: undefined, tax3Rate: undefined },
        quantity: product.quantity,
        reorder: product.reorder,
        barcodeNumber: product.barcodeNumber || "",
      });
    } else {
      form.reset({
        productName: "",
        hsnCode: "",
        price: 0,
        unit: "",
        category: "",
        productTax: { tax1Rate: undefined, tax2Rate: undefined, tax3Rate: undefined },
        quantity: undefined,
        reorder: undefined,
        barcodeNumber: "",
      });
    }
  }, [product, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, categoriesRes, taxesRes] = await Promise.all([
          axios.get("/productunits"),
          axios.get("/productcategories"),
          axios.get("/taxconfig"),
        ]);
        setUnits(unitsRes.data.productUnits || []);
        setCategories(categoriesRes.data.productCategories || []);
        setTaxConfig(taxesRes.data.taxConfig || null);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    if (open) fetchData();
  }, [open]);

  const onSubmit = async (data: any) => {
    try {
      if (product?._id) {
        await axios.put(`/products/${product._id}`, data);
      } else {
        await axios.post("/products", data);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.log("Error saving product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit" : "Add"} Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Controller
              name="productName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="productName">Product Name</FieldLabel>
                  <Input {...field} id="productName" placeholder="Enter product name" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="hsnCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hsnCode">HSN Code</FieldLabel>
                  <Input {...field} id="hsnCode" placeholder="Enter HSN code" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="unit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Unit</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {units.map((unit) => (
                          <SelectItem key={unit._id} value={unit._id!}>
                            {unit.unitName}
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
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id!}>
                            {cat.categoryName}
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
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="reorder"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reorder">Reorder Level</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="reorder"
                    type="number"
                    placeholder="Enter reorder level"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="barcodeNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="barcodeNumber">Barcode Number</FieldLabel>
                  <Input {...field} id="barcodeNumber" placeholder="Enter barcode" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            {taxConfig?.tax1 && (
              <Controller
                name="productTax.tax1Rate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tax1Rate">{taxConfig.tax1.taxName} Rate (%)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="tax1Rate"
                      type="number"
                      placeholder={`Enter ${taxConfig.tax1.taxName} rate`}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}
            {taxConfig?.tax2 && (
              <Controller
                name="productTax.tax2Rate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tax2Rate">{taxConfig.tax2.taxName} Rate (%)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="tax2Rate"
                      type="number"
                      placeholder={`Enter ${taxConfig.tax2.taxName} rate`}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}
            {taxConfig?.tax3 && (
              <Controller
                name="productTax.tax3Rate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tax3Rate">{taxConfig.tax3.taxName} Rate (%)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="tax3Rate"
                      type="number"
                      placeholder={`Enter ${taxConfig.tax3.taxName} rate`}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-32">
              {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : product ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
