import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { salesSeriesSchema, type SalesSeries } from "@/validation/salesSeries.schema";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export default function EditSalesSeries() {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(salesSeriesSchema),
    mode: "onChange",
    defaultValues: {
      invoiceSeriesName: "",
      invoiceSeriesTitle: "",
      invoiceSeriesPrefix: "",
      invoiceSeriesTerms: "",
      invoiceSeriesStartingNumber: 1,
      invoiceTemplateNumber: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/salesseries/${id}`);
        const salesSeries = response.data.salesSeries;
        if (salesSeries) {
          form.reset({
            invoiceSeriesName: salesSeries.invoiceSeriesName,
            invoiceSeriesTitle: salesSeries.invoiceSeriesTitle,
            invoiceSeriesPrefix: salesSeries.invoiceSeriesPrefix || "",
            invoiceSeriesTerms: salesSeries.invoiceSeriesTerms || "",
            invoiceSeriesStartingNumber: salesSeries.invoiceSeriesStartingNumber,
            invoiceTemplateNumber: salesSeries.invoiceTemplateNumber,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data: SalesSeries) => {
    try {
      await axios.put(`/salesseries/${id}`, data);
      navigate("/sales/series/list");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Sales Series</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Controller
              name="invoiceSeriesName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceSeriesName">Series Name</FieldLabel>
                  <Input
                    {...field}
                    id="invoiceSeriesName"
                    placeholder="Enter series name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceSeriesTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceSeriesTitle">Series Title</FieldLabel>
                  <Input
                    {...field}
                    id="invoiceSeriesTitle"
                    placeholder="Enter series title"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceSeriesPrefix"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceSeriesPrefix">Prefix (Optional)</FieldLabel>
                  <Input
                    {...field}
                    id="invoiceSeriesPrefix"
                    placeholder="Enter prefix"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceSeriesStartingNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceSeriesStartingNumber">Starting Number</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ''}
                    id="invoiceSeriesStartingNumber"
                    type="number"
                    placeholder="Enter starting number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceTemplateNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceTemplateNumber">Template Number</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ''}
                    id="invoiceTemplateNumber"
                    type="number"
                    placeholder="Enter template number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="invoiceSeriesTerms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invoiceSeriesTerms">Terms (Optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="invoiceSeriesTerms"
                    placeholder="Enter terms and conditions"
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
              "Update Sales Series"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
