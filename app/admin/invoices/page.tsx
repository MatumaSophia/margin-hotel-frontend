'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Invoice,
  InvoiceStatus,
  getInvoices,
  findInvoicesByStatus,
} from '@/lib/api/invoice';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Invoice[] = statusFilter
        ? await findInvoicesByStatus(statusFilter)
        : await getInvoices();

      if (dateFilter) {
        data = data.filter((inv) => inv.issueDate === dateFilter);
      }

      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          All invoices, filterable by status and issue date.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as InvoiceStatus)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Issue date</label>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[160px]"
          />
        </div>

        {(statusFilter || dateFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter('');
              setDateFilter('');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* States */}
      {loading && <p className="text-sm text-muted-foreground">Loading invoices...</p>}
      {error && <p className="text-sm text-destructive">Error: {error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
                  <TableCell>{invoice.reference}</TableCell>
                  <TableCell>{invoice.bookingId}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell className="text-right">
                    R{invoice.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {/* Edit/Delete buttons coming in Step 4 */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}