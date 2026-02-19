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

type Receipt = {
  _id: string;
  customer: { name: string };
  account: { accountName: string };
  receiptAmount: number;
  receiptDate: string;
  receiptDescription?: string;
};

const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    accessorFn: (row) => row.customer.name,
  },
  {
    accessorKey: "accountName",
    header: "Receipt By",
    accessorFn: (row) => row.account.accountName,
  },
  {
    accessorKey: "receiptAmount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.receiptAmount.toFixed(2)}`,
  },
  {
    accessorKey: "receiptDate",
    header: "Date",
    cell: ({ row }) => formatDateToDDMMYYYY(row.original.receiptDate),
  },
  {
    accessorKey: "receiptDescription",
    header: "Description",
    cell: ({ row }) => row.original.receiptDescription || "---",
  },
];

export default function ReceiptList() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get("/receipts");
      setReceipts(response.data.receipts);
    } catch (error) {
      console.log("Error fetching receipts:", error);
    }
  };

  const handleEdit = (receipt: Receipt) => {
    navigate(`/receipts/edit/${receipt._id}`);
  };

  const handleDelete = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedReceipt) return;
    try {
      await axios.delete(`/receipts/${selectedReceipt._id}`);
      fetchReceipts();
    } catch (error) {
      console.log("Error deleting receipt:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedReceipt(null);
    }
  };

  const actions: TableAction<Receipt>[] = [
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
    fetchReceipts();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Receipt List</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={() => navigate("/receipts/add")}>
              <Plus /> Add Receipt
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={receipts} searchKey="customerName" enableSorting actions={actions} />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Receipt"
        description={`Are you sure you want to delete this receipt?`}
      />
    </>
  );
}
