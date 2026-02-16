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
        const serpApiKey = Deno.env.get('SERPAPI_KEY')

        if (!query) {
            throw new Error('Query parameter is required')
        }

        let results: any[] = []

        if (serpApiKey) {
            console.log(`Searching SerpApi for: ${query}`)
            const response = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&google_domain=google.in&gl=in&hl=en`)
            const data = await response.json()

            if (data.shopping_results) {
                results = data.shopping_results.map((item: any) => ({
                    id: item.product_id || item.position,
                    term: query,
                    name: item.title,
                    image: item.thumbnail,
                    platforms: [
                        {
                            name: item.source || 'Google Shopping',
                            price: item.extract_price || item.price,
                            deliveryTime: item.delivery || '3-5 days',
                            rating: item.rating || 4.5,
                            deliveryFee: 0,
                            taxes: 0,
                            discountAmount: 0,
                            color: 'bg-blue-500',
                            link: item.link
                        }
                    ]
                })).slice(0, 5)
            }
        } else {
            console.log('No SERPAPI_KEY, returning mock data')
            // Fallback Mock Data
            results = [
                {
                    id: 'mock-1',
                    term: query,
                    name: `${query} (Mock Result)`,
                    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb363?w=200&h=200&fit=crop',
                    platforms: [
                        { name: 'Amazon', price: 999, deliveryTime: 'Tomorrow', rating: 4.5, deliveryFee: 0, taxes: 0, discountAmount: 100, color: 'bg-yellow-500', link: '#' },
                        { name: 'Flipkart', price: 949, deliveryTime: '2 Days', rating: 4.3, deliveryFee: 40, taxes: 0, discountAmount: 0, color: 'bg-blue-500', link: '#' }
                    ]
                }
            ]
        }

        return new Response(
            JSON.stringify(results),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || 'Unknown error' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
