export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export interface FuelService {
  name: string;
  capacity: number;
  stock: number;
}

export interface GasStation {
  id: string;
  userId: string;
  phone: string;
  zone: string;
  name: string;
  address: string;
  openingHours: OpeningHour[];
  services: FuelService[];
}
