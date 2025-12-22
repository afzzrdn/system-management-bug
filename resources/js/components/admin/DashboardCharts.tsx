import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

type DashboardChartsProps = {
    statusData: { name: string; value: number }[];
    priorityData: { name: string; value: number }[];
    trendData: { name: string; count: number }[];
    STATUS_COLORS: string[];
    STATUS_COLORS_GRADIENT: string[];
    PRIORITY_COLORS: string[];
    PRIORITY_COLORS_GRADIENT: string[];
};

export default function DashboardCharts({
    statusData,
    priorityData,
    trendData,
    STATUS_COLORS,
    STATUS_COLORS_GRADIENT,
    PRIORITY_COLORS,
    PRIORITY_COLORS_GRADIENT
}: DashboardChartsProps) {

    const renderLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: PieLabelRenderProps) => {
        if ((percent ?? 0) === 0) return null;

        const RAD = Math.PI / 180;
        const cxNum = Number(cx ?? 0);
        const cyNum = Number(cy ?? 0);
        const inner = Number(innerRadius ?? 0);
        const outer = Number(outerRadius ?? 0);

        const r = inner + (outer - inner) * 0.6;
        const x = cxNum + r * Math.cos(-midAngle * RAD);
        const y = cyNum + r * Math.sin(-midAngle * RAD);

        return (
            <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-sm font-semibold text-gray-50 drop-shadow-sm"
            >
                {`${((percent ?? 0) * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <>
            <div className="px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* STATUS CHART */}
                <div className="flex flex-col" data-tour="chart-status">
                    <h4 className="mb-2 text-center text-lg font-medium text-gray-600">Status</h4>
                    <div className="h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {statusData.map((_, i) => (
                                        <linearGradient key={i} id={`statusGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor={STATUS_COLORS[i]} stopOpacity={0.8} />
                                            <stop offset="100%" stopColor={STATUS_COLORS[i]} stopOpacity={0.4} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="56%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    labelLine={false}
                                    label={renderLabel}
                                    dataKey="value"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                >
                                    {statusData.map((_, i) => (
                                        <Cell key={i} fill={STATUS_COLORS_GRADIENT[i % STATUS_COLORS_GRADIENT.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }} formatter={(v: number, n: string) => [`${v} bug`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PRIORITY CHART */}
                <div className="flex flex-col" data-tour="chart-priority">
                    <h4 className="mb-2 text-center text-lg font-medium text-gray-600">Prioritas</h4>
                    <div className="h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {priorityData.map((_, i) => (
                                        <linearGradient key={i} id={`priorityGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor={PRIORITY_COLORS[i]} stopOpacity={0.8} />
                                            <stop offset="100%" stopColor={PRIORITY_COLORS[i]} stopOpacity={0.4} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="56%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    labelLine={false}
                                    label={renderLabel}
                                    dataKey="value"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                >
                                    {priorityData.map((_, i) => (
                                        <Cell key={i} fill={PRIORITY_COLORS_GRADIENT[i % PRIORITY_COLORS_GRADIENT.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }} formatter={(v: number, n: string) => [`${v} bug`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TREND CHART */}
            <div className="px-4 md:px-6 pb-6">
                <h4 className="mb-4 text-center text-lg font-medium text-gray-600">Tren Laporan Bug (7 Hari Terakhir)</h4>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#2563EB' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
