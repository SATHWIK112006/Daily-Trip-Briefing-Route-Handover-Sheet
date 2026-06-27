export enum TripStatus {
  SCHEDULED = 'Scheduled',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  DELAYED = 'Delayed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum TripPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum UserRole {
  ADMIN = 'Admin',
  OPERATIONS = 'Operations',
  DRIVER = 'Driver',
}

export interface TripCheckpoint {
  status: TripStatus;
  timestamp: string;
  completed: boolean;
  location: string;
}

export interface TripSafetyChecklist {
  insuranceVerified: boolean;
  licenseChecked: boolean;
  vehicleInspectionDone: boolean;
  routeReviewed: boolean;
  emergencyContactsVerified: boolean;
}

export interface Trip {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  driverId: string;
  driverName: string;
  vehicleId: string; // vehicle number
  vehicleModel: string;
  routeInstructions: string;
  customerNotes: string;
  emergencyContacts: string;
  specialRequirements: string;
  priority: TripPriority;
  status: TripStatus;
  lastUpdated: string;
  durationMinutes: number;
  revenue: number;
  driverPhoto: string;
  checkpoints: TripCheckpoint[];
  handoverApproved: boolean;
  briefingGenerated: boolean;
  safetyChecklist: TripSafetyChecklist;
}

export interface Vehicle {
  vehicleNumber: string;
  model: string;
  fuelType: 'Electric' | 'Hybrid' | 'Diesel' | 'Petrol';
  driverAssigned: string;
  insuranceStatus: 'Valid' | 'Expiring Soon' | 'Expired';
  serviceStatus: 'Good' | 'Due Soon' | 'In Service';
  capacity: number;
  healthIndicator: number; // 0-100%
  batteryFuelLevel: number; // 0-100%
  lastLocation: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  licenseNumber: string;
  performanceRating: number; // 4.0 - 5.0
  tripsCompleted: number;
  currentVehicle: string;
}

export interface SystemNotification {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  tripId?: string;
}

export interface AIAssistantMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isLoading?: boolean;
}
