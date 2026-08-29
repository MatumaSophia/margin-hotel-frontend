export interface Name {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface ContactDetails {
  email: string;
  mobile: string;
}

export interface Manager {
  staffId: number;
  name: Name;
  contactDetails: ContactDetails;
  officeNumber: string;
}

export interface Receptionist {
  staffId: number;
  name: Name;
  contactDetails: ContactDetails;
  deskNumber: string;
}

export interface NewManager {
  name: Name;
  contactDetails: ContactDetails;
  officeNumber: string;
}

export interface NewReceptionist {
  name: Name;
  contactDetails: ContactDetails;
  deskNumber: string;
}