import { History as HistoryIcon, Clock } from 'lucide-react';

export const History = () => {
    const historyItems = [
        { title: 'Biryani from Meghana Foods', time: '2 hours ago', price: '₹450' },
        { title: 'Uber to Airport', time: 'Yesterday', price: '₹890' },
        { title: 'iPhone 15 Case', time: '2 days ago', price: '₹1,200' },
    ];

    return (
        <div className="max-w-md mx-auto px-6 pt-8 pb-24">
            <h1 className="text-3xl font-serif italic text-ink mb-6">History</h1>

            <div className="space-y-4">
                {historyItems.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <HistoryIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-ink text-sm">{item.title}</h3>
                                <div className="flex items-center text-xs text-slate-400 mt-0.5">
                                    <Clock size={10} className="mr-1" /> {item.time}
                                </div>
                            </div>
                        </div>
                        <div className="font-bold text-ink">{item.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
