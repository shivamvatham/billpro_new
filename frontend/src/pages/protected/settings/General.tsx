import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import {
  companyDetailSchema,
  type CompanyDetail,
} from "@/validation/companyDetail.schema";
import { taxConfigSchema, type TaxConfig } from "@/validation/taxConfig.schema";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function General() {
  const companyForm = useForm<CompanyDetail>({
    resolver: zodResolver(companyDetailSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      address: "",
      contactNumber: "",
      email: "",
      gstNumber: "",
    },
  });

  const taxForm = useForm<TaxConfig>({
    resolver: zodResolver(taxConfigSchema),
    mode: "onChange",
    defaultValues: {
      taxType: "None",
      taxNumber: null,
      tax1: null,
      tax2: null,
      tax3: null,
    },
  });

  const taxType = taxForm.watch("taxType");

  useEffect(() => {
    if (taxType === "GST") {
      taxForm.setValue("tax1.taxName", "IGST");
      taxForm.setValue("tax2.taxName", "CGST");
      taxForm.setValue("tax3.taxName", "SGST");
    }
  }, [taxType, taxForm]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get("/companydetail");
        if (response.data.companyDetail) {
          companyForm.reset(response.data.companyDetail);
        }
      } catch (error) {
        console.log("Error fetching company details:", error);
      }
    };

    const fetchTaxConfig = async () => {
      try {
        const response = await axios.get("/taxconfig");
        if (response.data.taxConfig) {
          taxForm.reset(response.data.taxConfig);
        }
      } catch (error) {
        console.log("Error fetching tax config:", error);
      }
    };
    fetchCompanyDetails();
    fetchTaxConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCompanySubmit = async (data: CompanyDetail) => {
    try {
      const res = await axios.post("/companydetail", data);
      companyForm.reset(res.data.companyDetail);
    } catch (error) {
      console.log("Error saving company details:", error);
    }
  };

  const onTaxSubmit = async (data: TaxConfig) => {
    try {
      const payload = {
        ...data,
        tax1: data.taxType === "None" || !data.tax1?.taxName ? null : data.tax1,
        tax2:
          data.taxType === "None" ||
          data.taxType === "Service" ||
          !data.tax2?.taxName
            ? null
            : data.tax2,
        tax3:
          data.taxType === "None" ||
          data.taxType === "Service" ||
          !data.tax3?.taxName
            ? null
            : data.tax3,
      };
      const res = await axios.post("/taxconfig", payload);
      taxForm.reset(res.data.taxConfig);
    } catch (error) {
      console.log("Error saving tax config:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      {/* Company Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={companyForm.handleSubmit(onCompanySubmit)}
            className="space-y-2"
          >
            <Controller
              name="companyName"
              control={companyForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                  <Input
                    {...field}
                    id="companyName"
                    placeholder="Enter company name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="contactNumber"
              control={companyForm.control}
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
              control={companyForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="gstNumber"
              control={companyForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gstNumber">GST Number</FieldLabel>
                  <Input
                    {...field}
                    id="gstNumber"
                    placeholder="Enter GST number (optional)"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="address"
              control={companyForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea
                    {...field}
                    id="address"
                    placeholder="Enter company address"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button
              className="min-w-32"
              type="submit"
              disabled={companyForm.formState.isSubmitting}
            >
              {companyForm.formState.isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                "Save Details"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tax Config Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={taxForm.handleSubmit(onTaxSubmit)}
            className="space-y-2"
          >
            <Controller
              name="taxType"
              control={taxForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tax Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="GST">GST</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {(taxType === "GST" || taxType === "Service") && (
              <>
                <Controller
                  name="taxNumber"
                  control={taxForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="taxNumber">Tax Number</FieldLabel>
                      <Input
                        {...field}
                        value={field.value || ""}
                        id="taxNumber"
                        placeholder="Enter tax number"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <Controller
                    name="tax1.taxName"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax1Name">Tax 1 Name</FieldLabel>
                        <Input
                          {...field}
                          value={taxType === "GST" ? "IGST" : field.value || ""}
                          id="tax1Name"
                          placeholder="Enter tax name"
                          aria-invalid={fieldState.invalid}
                          readOnly={taxType === "GST"}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="tax1.taxRate"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax1Rate">
                          Tax 1 Rate (%)
                        </FieldLabel>
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="tax1Rate"
                          type="number"
                          placeholder="Enter tax rate"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Controller
                    name="tax2.taxName"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax2Name">Tax 2 Name</FieldLabel>
                        <Input
                          {...field}
                          value={taxType === "GST" ? "CGST" : field.value || ""}
                          id="tax2Name"
                          placeholder="Enter tax name"
                          aria-invalid={fieldState.invalid}
                          readOnly={taxType === "GST"}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="tax2.taxRate"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax2Rate">
                          Tax 2 Rate (%)
                        </FieldLabel>
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="tax2Rate"
                          type="number"
                          placeholder="Enter tax rate"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Controller
                    name="tax3.taxName"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax3Name">Tax 3 Name</FieldLabel>
                        <Input
                          {...field}
                          value={taxType === "GST" ? "SGST" : field.value || ""}
                          id="tax3Name"
                          placeholder="Enter tax name"
                          aria-invalid={fieldState.invalid}
                          readOnly={taxType === "GST"}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name="tax3.taxRate"
                    control={taxForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tax3Rate">
                          Tax 3 Rate (%)
                        </FieldLabel>
                        <Input
                          {...field}
                          value={field.value || ""}
                          id="tax3Rate"
                          type="number"
                          placeholder="Enter tax rate"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
              </>
            )}

            <Button
              className="min-w-32"
              type="submit"
              disabled={taxForm.formState.isSubmitting}
            >
              {taxForm.formState.isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                "Save Config"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
