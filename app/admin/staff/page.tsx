'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getAllManagers,
  getAllReceptionists,
  createManager,
  createReceptionist,
  updateManager,
  updateReceptionist,
  deleteManager,
  deleteReceptionist,
} from '@/lib/api/staff';
import { Manager, Receptionist } from '@/types/staff';

const staffFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  mobile: z.string().min(10, 'Enter a valid mobile number'),
  deskOrOffice: z.string().min(1, 'Required'),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;
type StaffType = 'manager' | 'receptionist';

export default function StaffPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // formOpenFor = which section the form is for; editingStaffId = null means
  // "creating new", otherwise it's the staffId of the row being edited.
  const [formOpenFor, setFormOpenFor] = useState<StaffType | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
  });

  async function loadStaff() {
    try {
      setLoading(true);
      const [managerData, receptionistData] = await Promise.all([
        getAllManagers(),
        getAllReceptionists(),
      ]);
      setManagers(managerData);
      setReceptionists(receptionistData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        'Could not load staff. Is the backend running on http://localhost:8080?'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function openCreateForm(type: StaffType) {
    setFormOpenFor(type);
    setEditingStaffId(null);
    setSubmitError(null);
    reset({ firstName: '', lastName: '', email: '', mobile: '', deskOrOffice: '' });
  }

  function openEditForm(type: StaffType, staff: Manager | Receptionist) {
    setFormOpenFor(type);
    setEditingStaffId(staff.staffId);
    setSubmitError(null);
    reset({
      firstName: staff.name.firstName,
      lastName: staff.name.lastName,
      email: staff.contactDetails.email,
      mobile: staff.contactDetails.mobile,
      deskOrOffice:
        type === 'manager'
          ? (staff as Manager).officeNumber
          : (staff as Receptionist).deskNumber,
    });
  }

  function closeForm() {
    setFormOpenFor(null);
    setEditingStaffId(null);
    setSubmitError(null);
    reset();
  }

  async function onSubmit(values: StaffFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const name = { firstName: values.firstName, lastName: values.lastName };
      const contactDetails = { email: values.email, mobile: values.mobile };

      if (formOpenFor === 'manager') {
        if (editingStaffId === null) {
          await createManager({ name, contactDetails, officeNumber: values.deskOrOffice });
        } else {
          await updateManager({
            staffId: editingStaffId,
            name,
            contactDetails,
            officeNumber: values.deskOrOffice,
          });
        }
      } else if (formOpenFor === 'receptionist') {
        if (editingStaffId === null) {
          await createReceptionist({ name, contactDetails, deskNumber: values.deskOrOffice });
        } else {
          await updateReceptionist({
            staffId: editingStaffId,
            name,
            contactDetails,
            deskNumber: values.deskOrOffice,
          });
        }
      }

      closeForm();
      await loadStaff();
    } catch (err) {
      console.error(err);
      setSubmitError('Could not save. Check the backend is running and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(type: StaffType, staffId: number, label: string) {
    const confirmed = window.confirm(`Delete ${label}? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(staffId);
    try {
      // Backend returns a plain boolean, always HTTP 200 - so we check the
      // body, not just whether the request "succeeded" (see gap #4/#10).
      const success =
        type === 'manager'
          ? await deleteManager(staffId)
          : await deleteReceptionist(staffId);

      if (!success) {
        alert('The backend reported this delete did not succeed.');
      }
      await loadStaff();
    } catch (err) {
      console.error(err);
      alert('Could not delete. Check the backend is running and try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p>Loading staff...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => openCreateForm('manager')}
          className="px-3 py-2 text-sm border rounded"
        >
          Add manager
        </button>
        <button
          onClick={() => openCreateForm('receptionist')}
          className="px-3 py-2 text-sm border rounded"
        >
          Add receptionist
        </button>
      </div>

      {formOpenFor && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border rounded p-4 mb-8 max-w-md space-y-3"
        >
          <h2 className="text-sm font-semibold mb-1">
            {editingStaffId === null ? 'New' : 'Edit'}{' '}
            {formOpenFor === 'manager' ? 'manager' : 'receptionist'}
          </h2>

          <div>
            <input
              {...register('firstName')}
              placeholder="First name"
              className="w-full border rounded px-2 py-1 text-sm"
            />
            {errors.firstName && (
              <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('lastName')}
              placeholder="Last name"
              className="w-full border rounded px-2 py-1 text-sm"
            />
            {errors.lastName && (
              <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('email')}
              placeholder="name@marginhotel.com"
              className="w-full border rounded px-2 py-1 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('mobile')}
              placeholder="0821234567"
              className="w-full border rounded px-2 py-1 text-sm"
            />
            {errors.mobile && (
              <p className="text-xs text-red-600 mt-1">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('deskOrOffice')}
              placeholder={
                formOpenFor === 'manager'
                  ? 'Office number (e.g. A101)'
                  : 'Desk number (e.g. D1)'
              }
              className="w-full border rounded px-2 py-1 text-sm"
            />
            {errors.deskOrOffice && (
              <p className="text-xs text-red-600 mt-1">{errors.deskOrOffice.message}</p>
            )}
          </div>

          {submitError && <p className="text-xs text-red-600">{submitError}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-2 text-sm border rounded bg-black text-white disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={closeForm} className="px-3 py-2 text-sm border rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="text-lg font-semibold mb-2">Managers</h2>
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4">Staff ID</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Mobile</th>
            <th className="py-2 pr-4">Office</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.length === 0 ? (
            <tr>
              <td className="py-2 text-muted-foreground" colSpan={6}>
                No managers found.
              </td>
            </tr>
          ) : (
            managers.map((m) => (
              <tr key={m.staffId} className="border-b">
                <td className="py-2 pr-4">{m.staffId}</td>
                <td className="py-2 pr-4">
                  {m.name.firstName} {m.name.lastName}
                </td>
                <td className="py-2 pr-4">{m.contactDetails.email}</td>
                <td className="py-2 pr-4">{m.contactDetails.mobile}</td>
                <td className="py-2 pr-4">{m.officeNumber}</td>
                <td className="py-2 pr-4 space-x-2">
                  <button
                    onClick={() => openEditForm('manager', m)}
                    className="text-xs underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete('manager', m.staffId, `${m.name.firstName} ${m.name.lastName}`)
                    }
                    disabled={deletingId === m.staffId}
                    className="text-xs underline text-red-600 disabled:opacity-50"
                  >
                    {deletingId === m.staffId ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-2">Receptionists</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4">Staff ID</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Mobile</th>
            <th className="py-2 pr-4">Desk</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {receptionists.length === 0 ? (
            <tr>
              <td className="py-2 text-muted-foreground" colSpan={6}>
                No receptionists found.
              </td>
            </tr>
          ) : (
            receptionists.map((r) => (
              <tr key={r.staffId} className="border-b">
                <td className="py-2 pr-4">{r.staffId}</td>
                <td className="py-2 pr-4">
                  {r.name.firstName} {r.name.lastName}
                </td>
                <td className="py-2 pr-4">{r.contactDetails.email}</td>
                <td className="py-2 pr-4">{r.contactDetails.mobile}</td>
                <td className="py-2 pr-4">{r.deskNumber}</td>
                <td className="py-2 pr-4 space-x-2">
                  <button
                    onClick={() => openEditForm('receptionist', r)}
                    className="text-xs underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(
                        'receptionist',
                        r.staffId,
                        `${r.name.firstName} ${r.name.lastName}`
                      )
                    }
                    disabled={deletingId === r.staffId}
                    className="text-xs underline text-red-600 disabled:opacity-50"
                  >
                    {deletingId === r.staffId ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}