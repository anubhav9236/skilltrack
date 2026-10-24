import { Client, Account, Databases } from 'appwrite';

// Environment variable extraction with sensible defaults for Appwrite Cloud
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6adc317c0013180b5f3a';
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'skilltrack_db';
export const APPWRITE_TABLE_ID = 
  import.meta.env.VITE_APPWRITE_TABLE_ID || 
  import.meta.env.VITE_APPWRITE_COLLECTION_ID || 
  'opportunities';

// Centralized Appwrite Client initialization
const client = new Client();

if (APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

/**
 * Returns true if the Appwrite project ID has been configured by the user.
 */
export function isAppwriteConfigured(): boolean {
  return Boolean(
    APPWRITE_PROJECT_ID && 
    APPWRITE_PROJECT_ID.trim().length > 0 && 
    !APPWRITE_PROJECT_ID.includes('your_project_id')
  );
}

/**
 * Validates connection to Appwrite Cloud.
 * Returns { success: boolean, message: string }
 */
export async function testAppwriteConnection(): Promise<{
  success: boolean;
  message: string;
  details?: {
    endpoint: string;
    projectId: string;
    databaseId: string;
    tableId: string;
  };
}> {
  const details = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID || 'Not configured',
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID,
  };

  if (!isAppwriteConfigured()) {
    return {
      success: false,
      message: 'Appwrite Project ID is not configured in .env',
      details,
    };
  }

  try {
    // Attempt to probe the Appwrite account service
    try {
      await account.get();
      return {
        success: true,
        message: 'Successfully connected to Appwrite! Active session detected.',
        details,
      };
    } catch (sessionErr: any) {
      // 401 is expected if not logged in, but means endpoint + project ID are reachable!
      if (sessionErr?.code === 401) {
        return {
          success: true,
          message: 'Successfully reached Appwrite project! (Endpoint and Project ID valid, ready for login)',
          details,
        };
      }
      throw sessionErr;
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Appwrite endpoint. Please check your credentials and CORS settings.',
      details,
    };
  }
}

export { client };
