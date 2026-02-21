import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { invoiceSchema, type Invoice } from "@/validation/invoice.schema";
import { useNavigate, useParams } from "react-router";
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

interface BaseData {
  customers: any[];
  invoiceSeries: any[];
  products: any[];
  taxConfigs: any[];
}

export default function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
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
      paidAmount: 0,
      grossAmount: 0,
      invoiceDate: new Date(),
      dueDate: new Date(),
      items: [{ itemId: "", price: 0, quantity: 1, rate: 0, discountPercentage: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [baseDataRes, invoiceRes] = await Promise.all([
          axios.get("/invoices/getBaseData"),
          axios.get(`/invoices/${id}`)
        ]);
        setBaseData(baseDataRes.data.data);
        const invoice = invoiceRes.data.data.invoice;
        form.reset({
          customerId: invoice.customerId,
          salesSeriesId: invoice.salesSeriesId,
          invoiceNumber: invoice.invoiceNumber,
          shippingAddress: invoice.shippingAddress || "",
          shippingAmount: invoice.shippingAmount || 0,
          paidAmount: invoice.paidAmount || 0,
          grossAmount: invoice.grossAmount,
          invoiceDate: new Date(invoice.invoiceDate),
          dueDate: new Date(invoice.dueDate),
          items: invoice.items
        });
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data: Invoice) => {
    try {
      await axios.put(`/invoices/${id}`, data);
      navigate("/sales/invoice/list");
    } catch (error) {
      console.log("error", error);
    }
  };

  if (!baseData) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Invoice</CardTitle>
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
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: "", price: 0, quantity: 1, rate: 0, discountPercentage: 0 })}>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                <Controller
                  name={`items.${index}.itemId`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="text-sm" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Product" />
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
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Price" 
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-sm"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name={`items.${index}.quantity`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Qty" 
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-sm"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name={`items.${index}.discountPercentage`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Discount %" 
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-sm"
                      />
                    </Field>
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Controller
              name="grossAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="grossAmount">Gross Amount</FieldLabel>
                  <Input 
                    {...field} 
                    id="grossAmount" 
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
            <Controller
              name="paidAmount"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="paidAmount">Paid Amount</FieldLabel>
                  <Input 
                    {...field} 
                    id="paidAmount" 
                    type="number" 
                    placeholder="0" 
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </Field>
              )}
            />
          </div>

          <Button className="min-w-32" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : "Update Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
