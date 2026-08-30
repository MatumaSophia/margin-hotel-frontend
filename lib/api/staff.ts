import { api } from './axios';
import {
  Manager,
  Receptionist,
  NewManager,
  NewReceptionist,
  UpdateManager,
  UpdateReceptionist,
} from '@/types/staff';

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
// Backend now expects a flat UpdateManager DTO, including staffId.
export async function updateManager(manager: UpdateManager): Promise<Manager> {
  const response = await api.put<Manager>('/staff/manager/update', manager);
  return response.data;
}

// PUT /marginhotel/staff/receptionist/update
export async function updateReceptionist(
  receptionist: UpdateReceptionist
): Promise<Receptionist> {
  const response = await api.put<Receptionist>(
    '/staff/receptionist/update',
    receptionist
  );
  return response.data;
}

// DELETE /marginhotel/staff/manager/delete/{id}
// Backend now returns 204 No Content on success, or 404 if not found.
// No response body - if this doesn't throw, the delete succeeded.
export async function deleteManager(staffId: number): Promise<void> {
  await api.delete(`/staff/manager/delete/${staffId}`);
}

// DELETE /marginhotel/staff/receptionist/delete/{id}
export async function deleteReceptionist(staffId: number): Promise<void> {
  await api.delete(`/staff/receptionist/delete/${staffId}`);
}