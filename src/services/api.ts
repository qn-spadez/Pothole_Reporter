import type { ReportPriority, BoundingBox } from '../types/report';

export interface DetectionResponse {
  success: boolean;
  potholes_detected: number;
  detections: BoundingBox[];
  annotated_image: string | null;
  image_width: number;
  image_height: number;
  inference_time_ms: number;
  model_name: string;
  highest_confidence: number;
  suggested_priority: ReportPriority;
  notice: string;
}

export interface HealthResponse {
  status: string;
  model_name: string;
  classes: string[];
  device: string;
  version: string;
}

// Fallback to direct backend URL if proxy is bypassed
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Checks if the backend AI inference service is reachable and healthy.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const url = `${API_BASE_URL}/api/health`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed with HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as HealthResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the AI detection backend. Please ensure FastAPI server is running on http://localhost:8000.'
      );
    }
    throw error;
  }
}

/**
 * Sends an image file or blob to the YOLOv8 pothole detection endpoint.
 */
export async function detectPotholes(file: File | Blob): Promise<DetectionResponse> {
  const url = `${API_BASE_URL}/api/detect`;
  const formData = new FormData();
  
  // Ensure a proper filename is set
  const filename = file instanceof File ? file.name : 'upload.jpg';
  formData.append('file', file, filename);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Detection failed with HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) {
          errorMessage = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as DetectionResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'AI backend connection failed. Ensure the FastAPI backend is running (e.g. uvicorn app.main:app --port 8000).'
      );
    }
    throw error;
  }
}
