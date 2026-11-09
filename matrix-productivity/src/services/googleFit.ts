import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface GoogleFitTelemetry {
  steps: number;
  activeMinutes: number;
  calories: number;
  lastSyncedAt: string;
  source: 'google-fit-api' | 'manual-sync';
}

const FIT_STORAGE_KEY = 'chrono_google_fit_telemetry';
const FIT_TOKEN_KEY = 'chrono_google_fit_access_token';

// Read cached telemetry from local storage
export function getStoredFitTelemetry(): GoogleFitTelemetry | null {
  try {
    const raw = localStorage.getItem(FIT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save telemetry to local storage
export function saveStoredFitTelemetry(data: GoogleFitTelemetry | null): void {
  if (!data) {
    localStorage.removeItem(FIT_STORAGE_KEY);
    localStorage.removeItem(FIT_TOKEN_KEY);
  } else {
    localStorage.setItem(FIT_STORAGE_KEY, JSON.stringify(data));
  }
}

// Retrieve stored access token
export function getStoredAccessToken(): string | null {
  return localStorage.getItem(FIT_TOKEN_KEY);
}

/**
 * Connect to Google Fit via Firebase GoogleAuthProvider with Fitness scopes.
 * Requests OAuth permissions for activity and body metrics.
 */
export async function authenticateGoogleFit(): Promise<{
  accessToken: string | null;
  error?: string;
}> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
    provider.addScope('https://www.googleapis.com/auth/fitness.body.read');
    provider.addScope('https://www.googleapis.com/auth/fitness.sleep.read');

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;

    if (accessToken) {
      localStorage.setItem(FIT_TOKEN_KEY, accessToken);
      return { accessToken };
    } else {
      return {
        accessToken: null,
        error: 'No OAuth access token was returned by Google authentication.',
      };
    }
  } catch (err: any) {
    console.error('Google Fit Auth Error:', err);
    return {
      accessToken: null,
      error: err?.message || 'Authentication with Google Fit was canceled or failed.',
    };
  }
}

/**
 * Fetch real step counts, active minutes, and calories from Google Fit REST API
 * for a 24-hour window (start of today to now).
 */
export async function fetchLiveGoogleFitData(accessToken: string): Promise<{
  data: GoogleFitTelemetry | null;
  error?: string;
}> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const startTimeMillis = startOfDay.getTime();
    const endTimeMillis = now.getTime();

    const response = await fetch(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json;encoding=utf-8',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId:
                'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
            },
            {
              dataTypeName: 'com.google.calories.expended',
            },
            {
              dataTypeName: 'com.google.active_minutes',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis,
          endTimeMillis,
        }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem(FIT_TOKEN_KEY);
      return {
        data: null,
        error: 'Google Fit session expired. Please reconnect your account.',
      };
    }

    if (response.status === 403) {
      return {
        data: null,
        error:
          'Google Fitness API is not enabled in your Google Cloud project console. Enable "Fitness API" in APIs & Services, or use Manual Step Input.',
      };
    }

    if (!response.ok) {
      const errBody = await response.text();
      console.warn('Google Fit API error response:', errBody);
      return {
        data: null,
        error: `Google Fit API returned status ${response.status}.`,
      };
    }

    const json = await response.json();

    let totalSteps = 0;
    let totalCalories = 0;
    let totalActiveMinutes = 0;

    // Parse buckets
    if (json.bucket && json.bucket.length > 0) {
      for (const bucket of json.bucket) {
        if (!bucket.dataset) continue;
        for (const ds of bucket.dataset) {
          if (!ds.point) continue;
          for (const pt of ds.point) {
            if (!pt.value) continue;
            for (const val of pt.value) {
              if (ds.dataSourceId?.includes('step_count')) {
                totalSteps += val.intVal || val.fpVal || 0;
              } else if (ds.dataSourceId?.includes('calories')) {
                totalCalories += Math.round(val.fpVal || val.intVal || 0);
              } else if (ds.dataSourceId?.includes('active_minutes')) {
                totalActiveMinutes += Math.round(val.intVal || val.fpVal || 0);
              }
            }
          }
        }
      }
    }

    // Fallback calculation for calories if steps exist but calories weren't returned by device
    if (totalSteps > 0 && totalCalories === 0) {
      totalCalories = Math.round(totalSteps * 0.045);
    }
    if (totalSteps > 0 && totalActiveMinutes === 0) {
      totalActiveMinutes = Math.round(totalSteps / 110);
    }

    const telemetry: GoogleFitTelemetry = {
      steps: totalSteps,
      activeMinutes: totalActiveMinutes,
      calories: totalCalories,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'google-fit-api',
    };

    saveStoredFitTelemetry(telemetry);
    return { data: telemetry };
  } catch (err: any) {
    console.error('Fetch Google Fit error:', err);
    return {
      data: null,
      error: 'Network failure while contacting Google Fit endpoints.',
    };
  }
}
