import { api } from "@/lib/api/axios";

export type InvoiceStatus = "PENDING" | "PAID";

export interface Invoice {
  invoiceId: number;
  reference: string;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string; // "yyyy-MM-dd"
  bookingId: number;
}

export interface CreateInvoiceRequest {
  reference: string;
  totalAmount: number;
  status?: InvoiceStatus;
  issueDate?: string;
  bookingId: number;
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  totalAmount?: number;
}

export async function getInvoices(): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>("/invoice/getall");
  return response.data;
}

export async function getInvoiceById(id: number): Promise<Invoice> {
  const response = await api.get<Invoice>(`/invoice/read/${id}`);
  return response.data;
}

export async function createInvoice(
  data: CreateInvoiceRequest
): Promise<Invoice> {
  const response = await api.post<Invoice>("/invoice/create", data);
  return response.data;
}

export async function updateInvoice(
  id: number,
  data: UpdateInvoiceRequest
): Promise<Invoice> {
  const response = await api.put<Invoice>(`/invoice/update/${id}`, data);
  return response.data;
}

export async function deleteInvoice(id: number): Promise<void> {
  await api.delete(`/invoice/delete/${id}`);
}

export async function findInvoicesByStatus(
  status: InvoiceStatus
): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>(`/invoice/findByStatus/${status}`);
  return response.data;
}

export async function findInvoicesByIssueDate(
  issueDate: string
): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>(
    `/invoice/findByIssueDate/${issueDate}`
  );
  return response.data;
}

export async function findInvoicesByBookingId(
  bookingId: number
): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>(
    `/invoice/findByBookingId/${bookingId}`
  );
  return response.data;
}