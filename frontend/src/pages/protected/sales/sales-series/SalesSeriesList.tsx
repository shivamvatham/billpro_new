import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Plus, Trash2, Pencil } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type SalesSeries = {
  _id: string;
  invoiceSeriesName: string;
  invoiceSeriesTitle: string;
  invoiceSeriesPrefix?: string;
  invoiceSeriesStartingNumber: number;
  invoiceTemplateNumber: number;
  invoiceTaxable: boolean;
};

const columns: ColumnDef<SalesSeries>[] = [
  {
    accessorKey: "invoiceSeriesName",
    header: "Series Name",
  },
  {
    accessorKey: "invoiceSeriesTitle",
    header: "Series Title",
  },
  {
    accessorKey: "invoiceSeriesPrefix",
    header: "Prefix",
    cell: ({ row }) => row.original.invoiceSeriesPrefix || "---",
  },
  {
    accessorKey: "invoiceSeriesStartingNumber",
    header: "Starting Number",
  },
  {
    accessorKey: "invoiceTemplateNumber",
    header: "Template",
  },
  {
    accessorKey: "invoiceTaxable",
    header: "Taxable",
    cell: ({ row }) => (row.original.invoiceTaxable ? "Yes" : "No"),
  },
];

export default function SalesSeriesList() {
  const navigate = useNavigate();
  const [salesSeries, setSalesSeries] = useState<SalesSeries[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<SalesSeries | null>(null);

  const fetchSalesSeries = async () => {
    try {
      const response = await axios.get("/salesseries");
      setSalesSeries(response.data.salesSeries);
    } catch (error) {
      console.log("Error fetching sales series:", error);
    }
  };

  const handleEdit = (series: SalesSeries) => {
    navigate(`/sales/series/edit/${series._id}`);
  };

  const handleDelete = (series: SalesSeries) => {
    setSelectedSeries(series);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedSeries) return;
    try {
      await axios.delete(`/salesseries/${selectedSeries._id}`);
      fetchSalesSeries();
    } catch (error) {
      console.log("Error deleting sales series:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedSeries(null);
    }
  };

  const actions: TableAction<SalesSeries>[] = [
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
    fetchSalesSeries();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales Series List</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={() => navigate("/sales/series/add")}>
              <Plus /> Add Sales Series
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={salesSeries} searchKey="invoiceSeriesName" enableSorting actions={actions} />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Sales Series"
        description={`Are you sure you want to delete this sales series?`}
      />
    </>
  );
}
