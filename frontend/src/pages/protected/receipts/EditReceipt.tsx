import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { receiptSchema, type Receipt } from "@/validation/receipt.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function EditReceipt() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const form = useForm({
    resolver: zodResolver(receiptSchema),
    mode: "onChange",
    defaultValues: {
      customer: "",
      account: "",
      receiptAmount: 0,
      receiptDate: "",
      receiptDescription: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, receiptRes] = await Promise.all([
          axios.get("/accounts"),
          axios.get(`/receipts/${id}`),
        ]);
        setAccounts(accountsRes.data.accounts || []);

        const receipt = receiptRes.data.receipt;
        if (receipt) {
          setCustomerName(receipt.customer.name);
          form.reset({
            customer: receipt.customer._id,
            account: receipt.account._id,
            receiptAmount: receipt.receiptAmount,
            receiptDate: new Date(receipt.receiptDate).toISOString().split('T')[0],
            receiptDescription: receipt.receiptDescription || "",
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data: Receipt) => {
    try {
      await axios.put(`/receipts/${id}`, data);
      navigate("/receipts/list");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Controller
              name="customer"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Customer Name</FieldLabel>
                  <Input
                    value={customerName}
                    disabled
                    className="bg-muted"
                  />
                  <input type="hidden" {...field} />
                </Field>
              )}
            />
            <Controller
              name="account"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Receipt By</FieldLabel>
                  <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn(fieldState.invalid && "border-destructive")} aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {accounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
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
              name="receiptAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="receiptAmount">Receipt Amount</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ''}
                    id="receiptAmount"
                    type="number"
                    placeholder="Enter receipt amount"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="receiptDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Receipt Date</FieldLabel>
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
              name="receiptDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="receiptDescription">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="receiptDescription"
                    placeholder="Enter receipt description (optional)"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <Button className="min-w-32" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              "Update Receipt"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
