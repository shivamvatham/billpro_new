import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type TableAction } from "@/components/DataTable";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Product } from "@/validation/product.schema";
import { useEffect, useState } from "react";
import axios from "@/util/request";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import ProductDialog from "./ProductDialog";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "hsnCode",
    header: "HSN Code",
    cell: ({ row }) => row.original.hsnCode || "---",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `₹${row.original.price || 0}`,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (row.original.unit as any)?.unitName || "---",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (row.original.category as any)?.categoryName || "---",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => row.original.quantity ?? "---",
  },
  {
    accessorKey: "barcodeNumber",
    header: "Barcode",
    cell: ({ row }) => row.original.barcodeNumber || "---",
  },
];

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setProductDialog(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await axios.delete(`/products/${selectedProduct._id}`);
      fetchProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
    } finally {
      setDeleteDialog(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductDialog(true);
  };

  const handleDialogClose = () => {
    setProductDialog(false);
    setSelectedProduct(null);
  };

  const actions: TableAction<Product>[] = [
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
    fetchProducts();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={handleAddProduct}>
              <Plus /> Add Product
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={products} searchKey="productName" enableSorting actions={actions} />
        </CardContent>
      </Card>
      <ProductDialog
        open={productDialog}
        onOpenChange={handleDialogClose}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${selectedProduct?.productName}?`}
      />
    </>
  );
}
