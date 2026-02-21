import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { invoiceSchema, type Invoice } from "@/validation/invoice.schema";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Trash2, Plus, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { calculateItemTotal, calculateInvoiceTotal } from "@/helpers/invoiceCalculations";

interface BaseData {
  customers: any[];
  invoiceSeries: any[];
  products: any[];
  taxConfigs: any[];
}

export default function AddInvoice() {
  const navigate = useNavigate();
  const [baseData, setBaseData] = useState<BaseData | null>(null);
  const [invoiceDateOpen, setInvoiceDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    mode: "onChange",
    defaultValues: {
      customerId: "",
      salesSeriesId: "",
      invoiceNumber: "",
      shippingAddress: "",
      shippingAmount: 0,
      grossAmount: 0,
      invoiceDate: new Date(),
      dueDate: new Date(),
      items: [{ itemId: "", description: "", quantity: 1, price: 0, discountPercentage: 0, tax: 0, finalPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const items = useWatch({ control: form.control, name: "items" });
  const shippingAmount = useWatch({ control: form.control, name: "shippingAmount" });
  const customerId = useWatch({ control: form.control, name: "customerId" });
  const salesSeriesId = useWatch({ control: form.control, name: "salesSeriesId" });
  const grossAmount = useWatch({ control: form.control, name: "grossAmount" });

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const response = await axios.get("/invoices/getBaseData");
        setBaseData(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchBaseData();
  }, []);

  useEffect(() => {
    if (!baseData || !items) return;
    const itemsWithTax = items.map((item, index) => ({
      ...item,
      tax: shouldShowTaxField() ? (item.tax || getCalculatedTax(index)) : 0
    }));
    const total = calculateInvoiceTotal(itemsWithTax, shippingAmount);
    form.setValue("grossAmount", Math.round(total));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, shippingAmount, baseData, salesSeriesId, customerId]);

  const getCalculatedTax = (itemIndex: number) => {
    if (!baseData || !salesSeriesId) return 0;
    
    const series = baseData.invoiceSeries.find(s => s._id === salesSeriesId);
    if (!series?.invoiceTaxable) return 0;

    const item = items[itemIndex];
    const product = baseData.products.find(p => p._id === item.itemId);
    if (!product) return 0;

    const taxConfig = baseData.taxConfigs[0];
    if (!taxConfig || taxConfig.taxType === 'None') return 0;

    if (taxConfig.taxType === 'GST') {
      const customer = baseData.customers.find(c => c._id === customerId);
      const isSameState = customer?.gstNumber && 
        customer.gstNumber.substring(0, 2) === (baseData.customers[0]?.gstNumber?.substring(0, 2) || '');
      
      if (isSameState) {
        return (product.tax2Rate || 0) + (product.tax3Rate || 0);
      } else {
        return product.tax1Rate || 0;
      }
    } else if (taxConfig.taxType === 'Service') {
      let total = 0;
      if (taxConfig.tax1) total += product.tax1Rate || taxConfig.tax1.taxRate || 0;
      if (taxConfig.tax2) total += product.tax2Rate || taxConfig.tax2.taxRate || 0;
      if (taxConfig.tax3) total += product.tax3Rate || taxConfig.tax3.taxRate || 0;
      return total;
    }
    
    return 0;
  };

  const shouldShowTaxField = () => {
    if (!baseData || !salesSeriesId) return false;
    const series = baseData.invoiceSeries.find(s => s._id === salesSeriesId);
    return series?.invoiceTaxable;
  };

  const onSubmit = async (data: Invoice) => {
    try {
      const payload = {
        ...data,
        items: data.items.map(item => ({
          itemId: item.itemId,
          price: item.price,
          quantity: item.quantity,
          discountPercentage: item.discountPercentage
        }))
      };
      await axios.post("/invoices", payload);
      navigate("/sales/invoice/list");
      form.reset();
    } catch (error) {
      console.log("error", error);
    }
  };

  if (!baseData) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <Controller
              name="customerId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Customer</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {baseData.customers.map(c => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="salesSeriesId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Sales Series</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select Series" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {baseData.invoiceSeries.map(s => (
                          <SelectItem key={s._id} value={s._id}>{s.invoiceSeriesName}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceNumber">Invoice Number</FieldLabel>
                  <Input {...field} id="invoiceNumber" placeholder="Enter invoice number" aria-invalid={fieldState.invalid} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="shippingAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="row-span-2">
                  <FieldLabel htmlFor="shippingAddress">Shipping Address</FieldLabel>
                  <textarea
                    {...field}
                    id="shippingAddress"
                    placeholder="Enter shipping address"
                    className="flex lg:min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <Controller
              name="invoiceDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Invoice Date</FieldLabel>
                  <Popover open={invoiceDateOpen} onOpenChange={setInvoiceDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-invalid={fieldState.invalid}
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
                          field.onChange(date);
                          setInvoiceDateOpen(false);
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
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Due Date</FieldLabel>
                  <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-invalid={fieldState.invalid}
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
                          field.onChange(date);
                          setDueDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            </div>
          </div>

          <div className="pt-1">
            <div>
              {fields.map((field, index) => {
                const item = items?.[index];
                if (!item) return null;
                const autoTax = getCalculatedTax(index);
                const product = baseData.products.find(p => p._id === item.itemId);
                const displayTax = shouldShowTaxField() ? (item.tax || autoTax) : 0;
                const calc = calculateItemTotal(item.price || 0, item.quantity || 0, item.discountPercentage || 0, displayTax);
                
                return (
                  <Card key={field.id} className="p-4 mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1">
                      <div className="md:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-0">
                          <Controller
                            name={`items.${index}.itemId`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Item</FieldLabel>
                                <Select value={field.value} onValueChange={(value) => {
                                  field.onChange(value);
                                  const product = baseData.products.find(p => p._id === value);
                                  if (product) {
                                    form.setValue(`items.${index}.price`, product.price || 0);
                                  }
                                }}>
                                  <SelectTrigger aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Select Product" />
                                  </SelectTrigger>
                                  <SelectContent position="popper">
                                    <SelectGroup>
                                      {baseData.products.map(p => (
                                        <SelectItem key={p._id} value={p._id}>{p.productName}</SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FieldError errors={[fieldState.error]} />
                              </Field>
                            )}
                          />
                            <Controller
                            name={`items.${index}.price`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Price</FieldLabel>
                                <Input {...field} type="number" placeholder="0" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} aria-invalid={fieldState.invalid} />
                                <FieldError errors={[fieldState.error]} />
                              </Field>
                            )}
                          />
                          <Controller
                            name={`items.${index}.quantity`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Quantity</FieldLabel>
                                <Input {...field} type="number" placeholder="1" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} aria-invalid={fieldState.invalid} />
                                <FieldError errors={[fieldState.error]} />
                              </Field>
                            )}
                          />
                           <Controller
                            name={`items.${index}.description`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Input {...field} placeholder="Optional" />
                                <FieldError errors={[fieldState.error]} />
                              </Field>
                            )}
                          />
                          <Controller
                            name={`items.${index}.discountPercentage`}
                            control={form.control}
                            render={({ field,fieldState }) => (
                              <Field>
                                <FieldLabel>Discount %</FieldLabel>
                                <Input {...field} type="number" placeholder="0" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
                                <FieldError errors={[fieldState.error]} />
                              </Field>
                            )}
                          />
                          <div className="flex items-center justify-center">
                            <Button type="button" size="sm" className="w-full hover:bg-red-500 bg-destructive text-white" onClick={() => remove(index)}>
                              <Trash2 className="w-4" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg mt-3 lg:mt-0 p-2 bg-gray-50 dark:bg-black border flex flex-col justify-between">
                        <table className="w-full text-sm -mb-2">
                          <tbody>
                            {product?.hsnCode && (
                              <tr className="border-b">
                                <td className="py-1">HSN</td>
                                <td className="font-semibold text-right py-1">{product.hsnCode}</td>
                              </tr>
                            )}
                            <tr className="border-b">
                              <td className="py-1">Subtotal</td>
                              <td className="font-semibold text-right py-1">{calc.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-1">After Discount</td>
                              <td className="font-semibold text-right py-1">{calc.afterDiscount.toFixed(2)}</td>
                            </tr>
                            {shouldShowTaxField() && displayTax > 0 && (
                              <tr className="border-b">
                                <td className="py-1">Tax ({displayTax.toFixed(2)}%)</td>
                                <td className="font-semibold text-right py-1">{((calc.afterDiscount || 0) * displayTax / 100).toFixed(2)}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="py-1">Final Price</td>
                              <td className="font-semibold text-right py-1">{calc.finalPrice.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="items-center mb-6">
              <Button 
                type="button" 
                className="bg-chart-2 hover:bg-chart-2/95" 
                size="sm" 
                onClick={async () => {
                  const lastIndex = fields.length - 1;
                  const isValid = await form.trigger([
                    `items.${lastIndex}.itemId`,
                    `items.${lastIndex}.price`,
                    `items.${lastIndex}.quantity`
                  ]);
                  if (isValid) {
                    append({ itemId: "", description: "", quantity: 1, price: 0, discountPercentage: 0, tax: 0, finalPrice: 0 });
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <Controller
              name="shippingAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shippingAmount">Shipping Amount</FieldLabel>
                  <Input 
                    {...field} 
                    id="shippingAmount" 
                    type="number" 
                    placeholder="0" 
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="roundOff">Round Off</FieldLabel>
              <Input
                id="roundOff"
                type="text"
                value={((grossAmount || 0) - Math.round(grossAmount || 0)).toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </Field>
            </div>
            <div className="rounded-lg p-3 border bg-gray-50 dark:bg-black">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="text-sm py-2">Subtotal</td>
                    <td className="text-sm font-semibold text-right">₹{(items || []).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="text-sm py-2">Discount</td>
                    <td className="text-sm font-semibold text-right">₹{(items || []).reduce((sum, item) => {
                      if (!item) return sum;
                      const subtotal = (item.price || 0) * (item.quantity || 0);
                      return sum + (subtotal * (item.discountPercentage || 0) / 100);
                    }, 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="text-sm py-2">Shipping</td>
                    <td className="text-sm font-semibold text-right">{(shippingAmount || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="text-sm py-2">Total</td>
                    <td className="text-sm font-semibold text-right">₹{(grossAmount || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Button className="min-w-32" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : "Create Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
