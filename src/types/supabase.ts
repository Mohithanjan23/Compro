export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    compro_id: string | null
                    coins: number
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    compro_id?: string | null
                    coins?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    compro_id?: string | null
                    coins?: number
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    brand: string
                    item_name: string
                    price: string
                    status: 'processed' | 'shipped' | 'out-for-delivery' | 'delivered'
                    logo_bg: string | null
                    logo_text: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    brand: string
                    item_name: string
                    price: string
                    status?: 'processed' | 'shipped' | 'out-for-delivery' | 'delivered'
                    logo_bg?: string | null
                    logo_text?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    brand?: string
                    item_name?: string
                    price?: string
                    status?: 'processed' | 'shipped' | 'out-for-delivery' | 'delivered'
                    logo_bg?: string | null
                    logo_text?: string | null
                    created_at?: string
                }
            }
        }
    }
}
