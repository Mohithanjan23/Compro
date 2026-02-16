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
        const searchApiKey = Deno.env.get('SEARCHAPI_KEY')

        if (!query) {
            throw new Error('Query parameter is required')
        }

        let results: any[] = []

        if (searchApiKey) {
            console.log(`Searching SearchApi.io for: ${query}`)
            // construct the URL for Google Shopping
            const url = new URL('https://www.searchapi.io/api/v1/search')
            url.searchParams.set('engine', 'google_shopping')
            url.searchParams.set('q', query)
            url.searchParams.set('api_key', searchApiKey)
            url.searchParams.set('location', 'India')
            url.searchParams.set('google_domain', 'google.in')
            url.searchParams.set('gl', 'in')
            url.searchParams.set('hl', 'en')

            const response = await fetch(url.toString())

            if (!response.ok) {
                throw new Error(`SearchApi error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()

            if (data.shopping_results) {
                results = data.shopping_results.map((item: any) => ({
                    id: item.product_id || String(Math.random()),
                    term: query,
                    name: item.title,
                    image: item.thumbnail,
                    platforms: [
                        {
                            name: item.source || 'Google Shopping',
                            price: item.price ? (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price) : 0,
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
            console.log('No SEARCHAPI_KEY, returning mock data')
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
