

import { api } from './axios';
import { Manager, Receptionist, NewManager, NewReceptionist } from '@/types/staff';
 
// GET /marginhotel/staff/manager/getall
export async function getAllManagers(): Promise<Manager[]> {
  const response = await api.get<Manager[]>('/staff/manager/getall');
  return response.data;
}
 
// GET /marginhotel/staff/receptionist/getall
export async function getAllReceptionists(): Promise<Receptionist[]> {
  const response = await api.get<Receptionist[]>('/staff/receptionist/getall');
  return response.data;
}
 
// POST /marginhotel/staff/manager/create
// staffId is not sent - the backend auto-generates it (GenerationType.IDENTITY)
export async function createManager(manager: NewManager): Promise<Manager> {
  const response = await api.post<Manager>('/staff/manager/create', manager);
  return response.data;
}
 
// POST /marginhotel/staff/receptionist/create
export async function createReceptionist(
  receptionist: NewReceptionist
): Promise<Receptionist> {
  const response = await api.post<Receptionist>(
    '/staff/receptionist/create',
    receptionist
  );
  return response.data;
}
 
// PUT /marginhotel/staff/manager/update
// Per the backend test plan: the endpoint expects the FULL Manager object,
// including staffId - not a partial patch.
export async function updateManager(manager: Manager): Promise<Manager> {
  const response = await api.put<Manager>('/staff/manager/update', manager);
  return response.data;
}
 
// PUT /marginhotel/staff/receptionist/update
export async function updateReceptionist(
  receptionist: Receptionist
): Promise<Receptionist> {
  const response = await api.put<Receptionist>(
    '/staff/receptionist/update',
    receptionist
  );
  return response.data;
}
 
// DELETE /marginhotel/staff/manager/delete/{id}
// Backend returns a raw boolean, always with HTTP 200 (see gap #4/#10 in the
// readiness doc) - so we return that boolean and let the caller check it,
// rather than trusting the HTTP status alone.
export async function deleteManager(staffId: number): Promise<boolean> {
  const response = await api.delete<boolean>(`/staff/manager/delete/${staffId}`);
  return response.data;
}
 
// DELETE /marginhotel/staff/receptionist/delete/{id}
export async function deleteReceptionist(staffId: number): Promise<boolean> {
  const response = await api.delete<boolean>(
    `/staff/receptionist/delete/${staffId}`
  );
  return response.data;
}
 
