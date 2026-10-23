import { ID, Query, Permission, Role } from 'appwrite';
import { 
  databases, 
  APPWRITE_DATABASE_ID, 
  APPWRITE_TABLE_ID, 
  isAppwriteConfigured 
} from '../lib/appwrite';
import { Opportunity, OpportunityInput } from '../types/database';

/**
 * Service to interact directly with Appwrite Databases / TablesDB.
 * Ensures user isolation via Query.equal('userId', userId) and row-level permissions.
 */
export const appwriteService = {
  /**
   * Fetch opportunities belonging to a specific user.
   */
  async listUserOpportunities(userId: string): Promise<Opportunity[]> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Missing Project ID or Endpoint.');
    }

    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]
      );

      return response.documents.map((doc: any) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        $permissions: doc.$permissions,
        userId: doc.userId,
        title: doc.title,
        organization: doc.organization,
        category: doc.category,
        description: doc.description || '',
        applicationUrl: doc.applicationUrl || '',
        deadline: doc.deadline,
        status: doc.status,
        priority: doc.priority,
        notes: doc.notes || '',
        isSaved: Boolean(doc.isSaved),
      }));
    } catch (error: any) {
      console.error('[AppwriteService] Error fetching opportunities from TablesDB:', error);
      throw error;
    }
  },

  /**
   * Create a new opportunity row in Appwrite TablesDB with document-level security.
   */
  async createOpportunity(userId: string, input: OpportunityInput): Promise<Opportunity> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Missing Project ID or Endpoint.');
    }

    // Set row-level permissions: only the creating user can read, update, or delete this record
    const permissions = [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];

    const payload = {
      userId,
      title: input.title.trim(),
      organization: input.organization.trim(),
      category: input.category,
      description: input.description.trim(),
      applicationUrl: input.applicationUrl.trim(),
      deadline: input.deadline,
      status: input.status,
      priority: input.priority,
      notes: (input.notes || '').trim(),
      isSaved: Boolean(input.isSaved),
    };

    try {
      const doc: any = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_ID,
        ID.unique(),
        payload,
        permissions
      );

      return {
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        $permissions: doc.$permissions,
        userId: doc.userId,
        title: doc.title,
        organization: doc.organization,
        category: doc.category,
        description: doc.description,
        applicationUrl: doc.applicationUrl,
        deadline: doc.deadline,
        status: doc.status,
        priority: doc.priority,
        notes: doc.notes,
        isSaved: Boolean(doc.isSaved),
      };
    } catch (error: any) {
      console.error('[AppwriteService] Error creating opportunity in TablesDB:', error);
      throw error;
    }
  },

  /**
   * Update an existing opportunity document.
   */
  async updateOpportunity(
    opportunityId: string, 
    updates: Partial<OpportunityInput>
  ): Promise<Opportunity> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured.');
    }

    try {
      const doc: any = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_ID,
        opportunityId,
        updates
      );

      return {
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        $permissions: doc.$permissions,
        userId: doc.userId,
        title: doc.title,
        organization: doc.organization,
        category: doc.category,
        description: doc.description,
        applicationUrl: doc.applicationUrl,
        deadline: doc.deadline,
        status: doc.status,
        priority: doc.priority,
        notes: doc.notes,
        isSaved: Boolean(doc.isSaved),
      };
    } catch (error: any) {
      console.error('[AppwriteService] Error updating opportunity:', error);
      throw error;
    }
  },

  /**
   * Delete an opportunity by ID.
   */
  async deleteOpportunity(opportunityId: string): Promise<void> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured.');
    }

    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_ID,
        opportunityId
      );
    } catch (error: any) {
      console.error('[AppwriteService] Error deleting opportunity:', error);
      throw error;
    }
  },

  /**
   * Toggle saved/bookmarked status of an opportunity.
   */
  async toggleSaved(opportunityId: string, currentSaved: boolean): Promise<Opportunity> {
    return this.updateOpportunity(opportunityId, { isSaved: !currentSaved });
  },

  /**
   * Update application status (e.g. Planning -> Applied -> Shortlisted -> Selected).
   */
  async updateStatus(opportunityId: string, status: any): Promise<Opportunity> {
    return this.updateOpportunity(opportunityId, { status });
  }
};
