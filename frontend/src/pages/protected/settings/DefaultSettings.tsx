import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DefaultSettingsForm {
  defaultInvoiceSeries?: string;
  defaultAccount?: string;
}

export default function DefaultSettings() {
  const [invoiceSeries, setInvoiceSeries] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const form = useForm<DefaultSettingsForm>({
    mode: "onChange",
    defaultValues: {
      defaultInvoiceSeries: "",
      defaultAccount: "",
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [seriesRes, accountsRes] = await Promise.all([
          axios.get("/salesseries"),
          axios.get("/accounts"),
        ]);
        setInvoiceSeries(seriesRes.data.salesSeries || []);
        setAccounts(accountsRes.data.accounts || []);
      } catch (error) {
        console.log("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchDefaults = async () => {
      if (invoiceSeries.length === 0 || accounts.length === 0) return;
      
      try {
        const settingsRes = await axios.get("/settings/defaults");
        if (settingsRes.data) {
          form.reset({
            defaultInvoiceSeries: settingsRes.data.defaultInvoiceSeries || "",
            defaultAccount: settingsRes.data.defaultAccount || "",
          });
        }
      } catch (error) {
        console.log("Error fetching defaults:", error);
      }
    };
    fetchDefaults();
  }, [invoiceSeries, accounts]);

  const onSubmit = async (data: DefaultSettingsForm) => {
    try {
      const response = await axios.put("/settings/defaults", data);
      if (response.data) {
        form.reset(response.data);
      }
    } catch (error) {
      console.log("Error saving default settings:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Controller
            name="defaultInvoiceSeries"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Default Invoice Series</FieldLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Invoice Series" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {invoiceSeries?.map((series) => (
                        <SelectItem key={series._id} value={series._id}>
                          {series.invoiceSeriesName}
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
            name="defaultAccount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Default Account</FieldLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {accounts?.map((account) => (
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

          <Button
            className="min-w-32"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              "Save Settings"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
