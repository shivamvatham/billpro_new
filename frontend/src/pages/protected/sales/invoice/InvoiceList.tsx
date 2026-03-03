import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Plus, Trash2, Pencil, Receipt, Printer } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDateToDDMMYYYY } from "@/util/dateFormat";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  invoicePrefix: string;
  customerId: string;
  customerName: string;
  grossAmount: number;
  paidAmount: number;
  invoiceDate: string;
  dueDate: string;
  invoiceTemplate: number;
  status: number;
};

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({row}) => `${row.original.invoicePrefix || ''}${row.original.invoiceNumber}`
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) =>formatDateToDDMMYYYY(row.original.invoiceDate)
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) =>formatDateToDDMMYYYY(row.original.dueDate)
  },
  {
    accessorKey: "grossAmount",
    header: "Amount",
    cell: ({ row }) => `${row.original.grossAmount.toFixed(2)}`
  },
  {
    accessorKey: "paidAmount",
    header: "Paid",
    cell: ({ row }) => `${row.original.paidAmount.toFixed(2)}`
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === 3) {
        return <span className="text-green-500 font-semibold">Paid</span>;
      }
      if (status === 2) {
        return <span className="text-red-500 font-semibold">Overdue</span>;
      }
      return <span className="text-orange-400 font-semibold">Open</span>;
    }
  }
];

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/invoices");
      setInvoices(response.data.invoices);
    } catch (error) {
      console.log("Error fetching invoices:", error);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    navigate(`/sales/invoice/edit/${invoice._id}`);
  };

  const handleReceipt = (invoice: Invoice) => {
    const pendingAmount = invoice.grossAmount - invoice.paidAmount;
    navigate(`/receipts/add?invoiceId=${invoice._id}&amount=${pendingAmount}&customerId=${invoice.customerId}`);
  };

  const handlePrint = (invoice: Invoice) => {
    const templateNumber = invoice?.invoiceTemplate ? invoice.invoiceTemplate : 1;
    navigate(`/sales/invoice/invoiceTemp${templateNumber}/${invoice._id}`);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;
    try {
      await axios.delete(`/invoices/${selectedInvoice._id}`);
      fetchInvoices();
    } catch (error) {
      console.log("Error deleting invoice:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedInvoice(null);
    }
  };

  const actions: TableAction<Invoice>[] = [
       {
      label: "",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "",
      icon: <Receipt className="h-4 w-4 text-blue-500" />,
      onClick: handleReceipt,
    },
    {
      label: "",
      icon: <Printer className="h-4 w-4 text-orange-500" />,
      onClick: handlePrint,
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      onClick: handleDelete,
    }
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={() => navigate("/sales/invoice/add")}>
              <Plus /> Add Invoice
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={invoices} searchKey="invoiceNumber" enableSorting actions={actions} />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice?"
      />
    </>
  );
}
