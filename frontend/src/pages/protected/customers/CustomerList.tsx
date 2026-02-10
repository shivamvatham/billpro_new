import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Customer } from "@/validation/customer.schema";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "openingBalance",
    header: "Balance",
    cell: ({ row }) => row.original.openingBalance || "---",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => row.original.contactNumber || "---",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "---",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => row.original.state || "---",
  },
  {
    accessorKey: "gstNumber",
    header: "GST Number",
    cell: ({ row }) => row.original.gstNumber || "---",
  },
];

export default function CustomerList() {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState<Customer[]>([]);
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/customers");
      setCustomers(response.data.customers);
    } catch (error) {
      console.log("Error fetching customers:", error);
    }
  };

  const handleEdit = (customer: Customer) => {
    navigate(`/customer/edit/${customer._id}`)
  };

  const handleDelete = async (customer: Customer) => {
    try {
      await axios.delete(`/customers/${customer._id}`);
      fetchCustomers();
    } catch (error) {
      console.log("Error deleting customer:", error);
    }
  };

  const actions: TableAction<Customer>[] = [
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
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <CardAction><Button variant="outline" onClick={() => navigate('/customer/add')}><UserPlus /> Add Customer</Button></CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={customers} searchKey="name" enableSorting actions={actions} />
      </CardContent>
    </Card>
  );
}
