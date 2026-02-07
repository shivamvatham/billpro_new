import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { customerSchema, type Customer, } from "@/validation/customer.schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES_WITH_GST_CODE } from "@/constants/indian-states";

export default function AddCustomer() {
    const form = useForm({
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

    const onSubmit = async (data: Customer) => {
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
                                    <FieldLabel>State</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                {INDIAN_STATES_WITH_GST_CODE.map((val) => (
                                                    <SelectItem key={val} value={val}>
                                                        {val}
                                                    </SelectItem>
                                                ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
