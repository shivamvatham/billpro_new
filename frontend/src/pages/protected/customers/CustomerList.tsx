import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Customer } from "@/validation/customer.schema";
import { useEffect, useState } from "react";
import axios from "@/util/request";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "gstNumber",
    header: "GST Number",
  },
];

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  console.log(customers)

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/customers");
      console.log(response)
      setCustomers(response.data.customers);
    } catch (error) {
      console.log("Error fetching customers:", error);
    }
  };

  const handleEdit = (customer: Customer) => {
    console.log("Edit customer:", customer);
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
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={customers} searchKey="name" enableSorting actions={actions} />
      </CardContent>
    </Card>
  );
}
