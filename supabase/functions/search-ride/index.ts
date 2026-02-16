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

        console.log(`Searching Rides for: ${query}`)

        // In a real app, this would use the Uber Ride Request API (requires OAUTH)
        // or Google Maps Routes API to estimate costs based on distance to 'query' location

        const mockResults = [
            {
                id: `ride-${Date.now()}-1`,
                term: query,
                name: `Ride to ${query}`,
                image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop",
                platforms: [
                    { name: 'Uber', price: 450, deliveryTime: 4, rating: 4.8, deliveryFee: 0, taxes: 20, discountCode: '', discountAmount: 0, color: 'bg-black', link: 'https://m.uber.com' },
                    { name: 'Ola', price: 430, deliveryTime: 8, rating: 4.5, deliveryFee: 0, taxes: 15, discountCode: '', discountAmount: 0, color: 'bg-lime-600', link: 'https://ola.cabs' },
                    { name: 'Rapido', price: 250, deliveryTime: 12, rating: 4.3, deliveryFee: 0, taxes: 10, discountCode: 'BIKE', discountAmount: 0, color: 'bg-yellow-400', link: 'https://rapido.bike' },
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
