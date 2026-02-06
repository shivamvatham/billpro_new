import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";

const customerSchema = z.object({
  name: z.string().trim().min(1, { message: "Customer name is required" }),
  contactNumber: z.string(),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .or(z.literal("")),
  address: z.string(),
  state: z.string(),
  gstNumber: z.string(),
  creditPeriodDays: z.number().int().min(0),
  openingBalance: z.number(),
});

export default function AddCustomer() {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      state: "24-Gujarat",
      gstNumber: "",
      creditPeriodDays: 0,
      openingBalance: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    try {
      const response = await axios.post("/customers", data);
      console.log("Customer added:", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Customer Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter customer name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="contactNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contactNumber">
                    Contact Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contactNumber"
                    placeholder="Enter contact number"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input {...field} id="email" placeholder="Enter email" aria-invalid={fieldState.invalid} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input {...field} id="state" aria-invalid={fieldState.invalid} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="gstNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gstNumber">GST Number</FieldLabel>
                  <Input
                    {...field}
                    id="gstNumber"
                    placeholder="Enter GST number"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="creditPeriodDays"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="creditPeriodDays">
                    Credit Period (Days)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="creditPeriodDays"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="openingBalance"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="openingBalance">
                    Opening Balance
                  </FieldLabel>
                  <Input
                    {...field}
                    id="openingBalance"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea
                    {...field}
                    id="address"
                    placeholder="Enter address"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              "Add Customer"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
