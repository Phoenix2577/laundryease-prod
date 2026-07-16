export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          student_id: string;
          full_name: string;
          email: string;
          phone: string;
          hostel_block: string;
          room_number: string;
          laundry_quota_remaining: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      laundry_requests: {
        Row: {
          id: string;
          ticket_number: number;
          student_id: string;
          pickup_date: string;
          pickup_time_slot: string;
          items: Record<string, number>;
          total_items: number;
          wash_type: string;
          detergent: string;
          special_instructions: string;
          status: string;
          cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['laundry_requests']['Row'], 'id' | 'ticket_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['laundry_requests']['Insert']>;
      };
      feedback: {
        Row: {
          id: string;
          request_id: string;
          student_id: string;
          rating: number;
          improvements: string[];
          new_features: string;
          easier_laundry: string;
          comments: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feedback']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['feedback']['Insert']>;
      };
    };
  };
}