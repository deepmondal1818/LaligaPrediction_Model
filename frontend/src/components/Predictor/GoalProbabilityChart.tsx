import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface GoalProbabilityChartProps {
    data: { name: string, value: number, color: string }[];
}

export function GoalProbabilityChart({ data }: GoalProbabilityChartProps) {
    return (
        <div className="bg-card/20 border border-border/40 rounded-3xl p-8 space-y-6 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Market Probabilities
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontWeight: 'bold', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
