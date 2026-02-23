import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Plus, Trash2, Pencil } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  grossAmount: number;
  invoiceDate: string;
  dueDate: string;
};

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number"
  },
  {
    accessorKey: "customerId",
    header: "Customer ID"
  },
  {
    accessorKey: "grossAmount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.grossAmount.toFixed(2)}`
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => new Date(row.original.invoiceDate).toLocaleDateString()
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString()
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
      variant: "ghost"
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      onClick: handleDelete,
      variant: "ghost"
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
