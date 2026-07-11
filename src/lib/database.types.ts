export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          lucide: string | null
          short: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          lucide?: string | null
          short?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          lucide?: string | null
          short?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string
          id: string
          image_url: string
          sort_order: number
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          available: boolean
          calories: number | null
          carbs: number | null
          category_id: string | null
          created_at: string
          description: string | null
          fat: number | null
          id: string
          image_url: string | null
          ingredients: string[]
          is_new: boolean
          long_description: string | null
          name: string
          popular: boolean
          price: number
          protein: number | null
          rating: number
          reviews: number
          slug: string
          sort_order: number
          updated_at: string
          veg: boolean
        }
        Insert: {
          available?: boolean
          calories?: number | null
          carbs?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[]
          is_new?: boolean
          long_description?: string | null
          name: string
          popular?: boolean
          price?: number
          protein?: number | null
          rating?: number
          reviews?: number
          slug: string
          sort_order?: number
          updated_at?: string
          veg?: boolean
        }
        Update: {
          available?: boolean
          calories?: number | null
          carbs?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[]
          is_new?: boolean
          long_description?: string | null
          name?: string
          popular?: boolean
          price?: number
          protein?: number | null
          rating?: number
          reviews?: number
          slug?: string
          sort_order?: number
          updated_at?: string
          veg?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_info: {
        Row: {
          address: string | null
          branches: Json
          description: string | null
          email: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          hours: Json
          id: string
          name: string
          phone: string | null
          socials: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          branches?: Json
          description?: string | null
          email?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hours?: Json
          id?: string
          name?: string
          phone?: string | null
          socials?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          branches?: Json
          description?: string | null
          email?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hours?: Json
          id?: string
          name?: string
          phone?: string | null
          socials?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
