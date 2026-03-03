import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "@/util/request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateToDDMMYYYY } from "@/util/dateFormat";

type InvoiceItem = {
  itemId: string;
  quantity: number;
  price: number;
  finalPrice: number;
};

type InvoicePrintData = {
  _id: string;
  invoiceNumber: string;
  invoicePrefix?: string;
  invoiceDate: string;
  dueDate: string;
  grossAmount: number;
  paidAmount: number;
  shippingAddress?: string;
  customerId?: {
    name?: string;
    email?: string;
    phone?: string;
    billingAddress?: string;
  };
  items: InvoiceItem[];
};

export default function InvoiceTemp1() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoicePrintData | null>(null);

  useEffect(() => {
    const fetchPrintData = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/invoices/print/${id}`);
        setInvoice(response.data.invoice);
        setTimeout(() => {
        window.print();
        }, 200);
      } catch (error) {
        console.log("Error fetching invoice print data:", error);
      }
    };

    fetchPrintData();
  }, [id]);

  if (!invoice) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Loading print template...</CardContent>
      </Card>
    );
  }

  const pendingAmount = Math.max(0, invoice.grossAmount - invoice.paidAmount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Print - Template 1</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Invoice Number</p>
            <p className="font-medium">
              {(invoice.invoicePrefix || "") + invoice.invoiceNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Invoice Date</p>
            <p className="font-medium">{formatDateToDDMMYYYY(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">{formatDateToDDMMYYYY(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{invoice.customerId?.name || "-"}</p>
          </div>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`${item.itemId}-${index}`} className="border-b last:border-b-0">
                  <td className="px-3 py-2">{item.itemId}</td>
                  <td className="px-3 py-2 text-right">{item.quantity}</td>
                  <td className="px-3 py-2 text-right">{item.price.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{item.finalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-md border p-3">
            <p className="text-sm text-muted-foreground">Gross Amount</p>
            <p className="font-semibold">{invoice.grossAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-sm text-muted-foreground">Paid Amount</p>
            <p className="font-semibold">{invoice.paidAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="font-semibold">{pendingAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
