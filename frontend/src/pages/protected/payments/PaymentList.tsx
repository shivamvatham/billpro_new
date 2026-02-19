import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Plus, Trash2, Pencil } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDateToDDMMYYYY } from "@/util/dateFormat";

type Payment = {
  _id: string;
  customer: { name: string };
  account: { accountName: string };
  paymentAmount: number;
  paymentDate: string;
  paymentDescription?: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    accessorFn: (row) => row.customer.name,
  },
  {
    accessorKey: "accountName",
    header: "Payment By",
    accessorFn: (row) => row.account.accountName,
  },
  {
    accessorKey: "paymentAmount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.paymentAmount.toFixed(2)}`,
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }) => formatDateToDDMMYYYY(row.original.paymentDate),
  },
  {
    accessorKey: "paymentDescription",
    header: "Description",
    cell: ({ row }) => row.original.paymentDescription || "---",
  },
];

export default function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/payments");
      setPayments(response.data.payments);
    } catch (error) {
      console.log("Error fetching payments:", error);
    }
  };

  const handleEdit = (payment: Payment) => {
    navigate(`/payments/edit/${payment._id}`);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedPayment) return;
    try {
      await axios.delete(`/payments/${selectedPayment._id}`);
      fetchPayments();
    } catch (error) {
      console.log("Error deleting payment:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedPayment(null);
    }
  };

  const actions: TableAction<Payment>[] = [
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

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={() => navigate("/payments/add")}>
              <Plus /> Add Payment
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={payments} searchKey="customerName" enableSorting actions={actions} />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Payment"
        description={`Are you sure you want to delete this payment?`}
      />
    </>
  );
}
