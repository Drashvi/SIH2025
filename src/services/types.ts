// Types for the attendance system
export interface AttendanceRecord {
  name: string;
  time: string;
}

export interface AttendanceResponse {
  date: string;
  records: AttendanceRecord[];
}

export interface ApiStatus {
  camera_active: boolean;
  attendance_active: boolean;
  people_in_database: number;
}

export interface ApiResponse {
  status?: string;
  error?: string;
  embeddings_count?: number;
}
