// NOTE: You must set SERPAPI_KEY in your Supabase project secrets:
// npx supabase secrets set SERPAPI_KEY=your_key_here
// @ts-expect-error Deno std module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-expect-error Deno serve type
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query } = await req.json()
        // @ts-expect-error Deno.env
        const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY')

        if (!SERPAPI_KEY) {
            throw new Error('SERPAPI_KEY is missing in Edge Function secrets.')
        }

        if (!query) {
            throw new Error('Query parameter is required.')
        }

        console.log(`Searching for: ${query}`)

        // reliable Google Shopping Search via SerpApi
        const url = new URL('https://serpapi.com/search')
        url.searchParams.append('engine', 'google_shopping')
        url.searchParams.append('q', query)
        url.searchParams.append('api_key', SERPAPI_KEY)
        url.searchParams.append('google_domain', 'google.co.in') // Localize for India
        url.searchParams.append('gl', 'in')
        url.searchParams.append('hl', 'en')
        url.searchParams.append('currency', 'INR')

        const response = await fetch(url.toString())
        const data = await response.json()

        if (data.error) {
            throw new Error(data.error)
        }

        // Normalize Data for App
        const shoppingResults = data.shopping_results || []

        // Transform to App's Schema (ServiceResult)
        // Since this is a "Comparison" engine, we group by product if possible,
        // but Google Shopping returns individual offers.
        // For this demo, check "stores" in results or treat each result as a potential match.

        // Simplified: Take top 3 distinct items or best offers
        interface SerpItem { product_id?: string; title?: string; thumbnail?: string; source?: string; price?: string; delivery?: string; rating?: number; link?: string }
        const processedItems = shoppingResults.slice(0, 5).map((item: SerpItem, index: number) => ({
            id: item.product_id || `serp-${index}`,
            term: query,
            name: item.title,
            image: item.thumbnail,
            platforms: [
                {
                    name: item.source || 'Google Store',
                    price: item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0,
                    deliveryTime: item.delivery || 'Standard',
                    rating: item.rating || 0,
                    deliveryFee: 0, // Often included or unknown
                    taxes: 0,
                    link: item.link, // Save link for "Order Now"
                    color: 'bg-blue-600'
                },
                // Mocking a competitor for comparison effect if "stores" data is missing
                {
                    name: 'Competitor',
                    price: (item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 1000) * 1.05, // +5%
                    deliveryTime: 'slower',
                    rating: 4.0,
                    deliveryFee: 50,
                    taxes: 0,
                    color: 'bg-gray-500'
                }
            ],
            category: 'shop',
            bestPrice: 0, // Computed on client
            fastestTime: 0, // Computed on client
            savings: 0 // Computed on client
        }))

        return new Response(
            JSON.stringify(processedItems),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
