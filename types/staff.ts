export interface Manager {
  staffId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  officeNumber: string;
}

export interface Receptionist {
  staffId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  deskNumber: string;
}

export interface NewManager {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  officeNumber: string;
}

export interface NewReceptionist {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  deskNumber: string;
}

// Used for updates - includes staffId since the backend needs to know which record to update
export interface UpdateManager extends NewManager {
  staffId: number;
}

export interface UpdateReceptionist extends NewReceptionist {
  staffId: number;
}