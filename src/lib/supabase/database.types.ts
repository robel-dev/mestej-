// Database types will be generated from Supabase
// For now, we'll define a basic structure that matches our schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          resource_type: string | null
          resource_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      website_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin'
          status: 'pending' | 'approved' | 'rejected' | 'blocked'
          permit_document_url: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'user' | 'admin'
          status?: 'pending' | 'approved' | 'rejected' | 'blocked'
          permit_document_url?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin'
          status?: 'pending' | 'approved' | 'rejected' | 'blocked'
          permit_document_url?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          product_type: 'wine' | 'liquor' | 'merchandise'
          supplier_id: string | null
          image_url: string | null
          abv: number | null
          volume_ml: number | null
          stock_quantity: number
          availability: 'in_stock' | 'out_of_stock'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          product_type: 'wine' | 'liquor' | 'merchandise'
          supplier_id?: string | null
          image_url?: string | null
          abv?: number | null
          volume_ml?: number | null
          stock_quantity?: number
          availability?: 'in_stock' | 'out_of_stock'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          product_type?: 'wine' | 'liquor' | 'merchandise'
          supplier_id?: string | null
          image_url?: string | null
          abv?: number | null
          volume_ml?: number | null
          stock_quantity?: number
          availability?: 'in_stock' | 'out_of_stock'
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string | null
          user_id: string
          status: 'placed' | 'paid' | 'cancelled' | 'fulfilled'
          total_amount: number
          currency: string
          delivery_addr: Json
          created_at: string
          fulfilled_at: string | null
        }
        Insert: {
          id?: string
          order_number?: string | null
          user_id: string
          status?: 'placed' | 'paid' | 'cancelled' | 'fulfilled'
          total_amount: number
          currency?: string
          delivery_addr: Json
          created_at?: string
          fulfilled_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string | null
          user_id?: string
          status?: 'placed' | 'paid' | 'cancelled' | 'fulfilled'
          total_amount?: number
          currency?: string
          delivery_addr?: Json
          created_at?: string
          fulfilled_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          unit_price: number
          line_total: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          unit_price: number
          line_total: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          unit_price?: number
          line_total?: number
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          recipient: string
          phone: string | null
          street: string
          postal_code: string
          city: string
          country: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipient: string
          phone?: string | null
          street: string
          postal_code: string
          city: string
          country?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipient?: string
          phone?: string | null
          street?: string
          postal_code?: string
          city?: string
          country?: string
          created_at?: string
        }
      }
      product_prices: {
        Row: {
          id: string
          product_id: string
          price: number
          currency: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          id?: string
          product_id: string
          price: number
          currency?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          price?: number
          currency?: string
          valid_from?: string
          valid_to?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_payment_update: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_user_approval: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      set_order_number: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_admin_id: string
          p_action: string
          p_resource_type?: string | null
          p_resource_id?: string | null
          p_metadata?: Json | null
        }
        Returns: string
      }
      approve_user: {
        Args: {
          p_user_id: string
          p_admin_id: string
        }
        Returns: boolean
      }
      reject_user: {
        Args: {
          p_user_id: string
          p_admin_id: string
          p_reason?: string | null
        }
        Returns: boolean
      }
      block_user: {
        Args: {
          p_user_id: string
          p_admin_id: string
          p_reason?: string | null
        }
        Returns: boolean
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_recent_activity: {
        Args: {
          p_limit?: number
        }
        Returns: {
          id: string
          admin_email: string
          action: string
          resource_type: string | null
          resource_id: string | null
          metadata: Json | null
          created_at: string
        }[]
      }
      fulfill_order: {
        Args: {
          p_order_id: string
          p_admin_id: string
        }
        Returns: boolean
      }
      cancel_order: {
        Args: {
          p_order_id: string
          p_admin_id: string
          p_reason?: string | null
        }
        Returns: boolean
      }
    }
    Enums: {
      availability_status: 'in_stock' | 'out_of_stock'
      notification_status: 'queued' | 'sent' | 'failed'
      notification_type: 'email' | 'system'
      order_status: 'placed' | 'paid' | 'cancelled' | 'fulfilled'
      payment_method: 'swish' | 'card' | 'bank_transfer'
      payment_status: 'pending' | 'paid' | 'failed'
      product_type: 'wine' | 'liquor' | 'merchandise'
      user_role: 'user' | 'admin'
      user_status: 'pending' | 'approved' | 'rejected' | 'blocked'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

