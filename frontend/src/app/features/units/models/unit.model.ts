export interface Unit {
  id: number;
  name: string;
  isActive: boolean;
  capacity: number;
  createdAt?: string;
}

export interface UnitPayload {
  name: string;
  capacity: number;
  isActive: boolean;
}
