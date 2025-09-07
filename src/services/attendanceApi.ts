// API service for Flask face detection attendance system
import type { AttendanceRecord, AttendanceResponse, ApiStatus, ApiResponse } from './types';

// Re-export types for convenience
export type { AttendanceRecord, AttendanceResponse, ApiStatus, ApiResponse } from './types';

class AttendanceApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Flask backend URL - adjust if your Flask server runs on a different port
    this.baseUrl = 'http://127.0.0.1:5000';
    // You should get this from environment variables in production
    this.apiKey = import.meta.env.VITE_FLASK_API_KEY || 'your-api-key-here';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Start camera and attendance
  async startCamera(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/start`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting camera:', error);
      throw error;
    }
  }

  // Stop camera and attendance
  async stopCamera(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stop`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error stopping camera:', error);
      throw error;
    }
  }

  // Get current system status
  async getStatus(): Promise<ApiStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  }

  // Get today's attendance records
  async getAttendanceRecords(): Promise<AttendanceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/attendance`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting attendance records:', error);
      throw error;
    }
  }

  // Capture person for face database (admin function)
  async capturePerson(name: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/capture_person`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error capturing person:', error);
      throw error;
    }
  }

  // Get video stream URL
  getVideoStreamUrl(): string {
    return `${this.baseUrl}/video`;
  }

  // Get admin panel URL (for iframe or external link)
  getAdminUrl(): string {
    return `${this.baseUrl}/admin`;
  }
}

export const attendanceApi = new AttendanceApiService();
export default attendanceApi;
