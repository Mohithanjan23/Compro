// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query } = await req.json()

        if (!query) {
            throw new Error('Query parameter is required')
        }

        console.log(`Searching Food for: ${query}`)

        // In a real scenario, this would call ONDC buyer app APIs or Zomato/Swiggy private APIs
        // For now, we return high-quality mock data to demonstrate the UI

        const mockResults = [
            {
                id: `food-${Date.now()}-1`,
                term: query,
                name: `${query} (Best Seller)`,
                image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop",
                platforms: [
                    { name: 'Zomato', price: 350, deliveryTime: 35, rating: 4.2, deliveryFee: 40, taxes: 25, discountCode: 'ZOMATO60', discountAmount: 100, color: 'bg-red-600', link: 'https://zomato.com' },
                    { name: 'Swiggy', price: 340, deliveryTime: 28, rating: 4.3, deliveryFee: 30, taxes: 25, discountCode: 'TRYNEW', discountAmount: 80, color: 'bg-orange-500', link: 'https://swiggy.com' },
                    { name: 'MagicPin', price: 350, deliveryTime: 45, rating: 4.0, deliveryFee: 10, taxes: 20, discountCode: 'ONDC50', discountAmount: 150, color: 'bg-purple-600', link: 'https://magicpin.in' },
                ]
            },
            {
                id: `food-${Date.now()}-2`,
                term: query,
                name: `Special ${query} Combo`,
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop",
                platforms: [
                    { name: 'Zomato', price: 450, deliveryTime: 40, rating: 4.5, deliveryFee: 20, taxes: 30, discountCode: 'TASTY', discountAmount: 50, color: 'bg-red-600', link: 'https://zomato.com' },
                    { name: 'Swiggy', price: 430, deliveryTime: 35, rating: 4.4, deliveryFee: 20, taxes: 30, discountCode: 'JUMBO', discountAmount: 60, color: 'bg-orange-500', link: 'https://swiggy.com' }
                ]
            }
        ]

        return new Response(
            JSON.stringify(mockResults),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || 'Unknown error' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
