"use client";

import { useEffect, useState } from "react";
import {
  getPayments,
  type Payment,
} from "@/lib/api/payment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await getPayments();
        setPayments(data);
      } catch {
        setError("Unable to load payments.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) return <p>Loading Payments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.paymentId} className="border-b">
            <td>{payment.paymentId}</td>
            <td>{payment.invoiceReference}</td>
            <td>R{payment.amount.toFixed(2)}</td>
            <td>
              <span className={payment.status === "SUCCESS" 
                ? "text-green-600" : payment.status === "FAILED" 
                ? "text-red-600" : 
                "text-yellow-600"}>
                {payment.status}
              </span>
            </td>
            <td>{payment.paymentDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}