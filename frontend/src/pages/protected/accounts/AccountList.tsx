import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Account, accountSchema } from "@/validation/account.schema";
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

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "accountDescription",
    header: "Description",
    cell: ({ row }) => row.original.accountDescription || "---",
  },
  {
    accessorKey: "openingBalance",
    header: "Opening Balance",
    cell: ({ row }) => row.original.openingBalance || 0,
  },
  {
    accessorKey: "currentBalance",
    header: "Current Balance",
    cell: ({ row }) => row.original.currentBalance || 0,
  },
];

export default function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const form = useForm<Account>({
    resolver: zodResolver(accountSchema),
    mode: "onChange",
    defaultValues: {
      accountName: "",
      accountDescription: "",
      openingBalance: null,
    },
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/accounts");
        setAccounts(response.data.accounts);
      } catch (error) {
        console.log("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
    
    const interval = setInterval(fetchAccounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.reset(account);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedAccount) return;
    try {
      await axios.delete(`/accounts/${selectedAccount._id}`);
      const response = await axios.get("/accounts");
      setAccounts(response.data.accounts);
    } catch (error) {
      console.log("Error deleting account:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedAccount(null);
    }
  };

  const onSubmit = async (data: Account) => {
    const datas = {
      ...data,
      openingBalance: data.openingBalance ?? 0
    }
    try {
      if (editingAccount) {
        await axios.put(`/accounts/${editingAccount._id}`, datas);
      } else {
        await axios.post("/accounts", datas);
      }
      const response = await axios.get("/accounts");
      setAccounts(response.data.accounts);
      setEditingAccount(null);
      form.reset({ accountName: "", accountDescription: "", openingBalance: null });
    } catch (error) {
      console.log("Error saving account:", error);
    }
  };

  const handleCancel = () => {
    setEditingAccount(null);
    form.reset({ accountName: "", accountDescription: "", openingBalance: null });
  };

  const actions: TableAction<Account>[] = [
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

  return (
    <>
       <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{editingAccount ? "Edit" : "Add"} Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="accountName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="accountName">Account Name</FieldLabel>
                    <Input
                      {...field}
                      id="accountName"
                      placeholder="Enter account name"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="accountDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="accountDescription">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="accountDescription"
                      placeholder="Enter description (optional)"
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
                    <FieldLabel htmlFor="openingBalance">Opening Balance</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      id="openingBalance"
                      type="number"
                      placeholder="Enter opening balance"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    editingAccount ? "Update" : "Create"
                  )}
                </Button>
                {editingAccount && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={accounts}
              searchKey="accountName"
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
        title="Delete Account"
        description={`Are you sure you want to delete ${selectedAccount?.accountName}? This action cannot be undone.`}
      />
    </>
  );
}
