import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public readonly adminClient: SupabaseClient;
  public readonly anonClient: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://ebofcxfajhbomzqyysxl.supabase.co';
    const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2ZjeGZhamhib216cXl5c3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODQzMzksImV4cCI6MjEwNDU2MDMzOX0.tEV2JGgQIoNDOnecJEtR8RNbth6srt38PnSUx4sH-l4';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2ZjeGZhamhib216cXl5c3hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk4NDMzOSwiZXhwIjoyMTA0NTYwMzM5fQ.vioN8PaAHrD1V1JWCpgE68AOkJWsWsKFon1jSj6tsrs';

    this.anonClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });

    this.adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    this.logger.log('SupabaseService initialized with admin client');
  }

  async verifyToken(token: string) {
    try {
      const { data, error } = await this.adminClient.auth.getUser(token);
      if (error || !data?.user) {
        return null;
      }
      return data.user;
    } catch (e) {
      this.logger.error('Failed to verify token with Supabase', e);
      return null;
    }
  }

  async createUserWithoutConfirmation(params: {
    email: string;
    password: string;
    fullName: string;
    department?: string;
    role?: string;
    phone?: string;
  }) {
    const { email, password, fullName, department = 'ENGINEERS', role = 'STUDENT', phone } = params;
    const { data, error } = await this.adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        fullName,
        department,
        role,
        phone,
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }
}
