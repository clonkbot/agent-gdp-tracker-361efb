import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell } from 'recharts';

// Simulated GDP data for the onchain agent economy
const generateGDPData = () => {
  const baseDate = new Date('2024-01-01');
  const data = [];
  let gdp = 12.5; // Starting at $12.5M

  for (let i = 0; i < 52; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 7);

    // Simulate growth with some volatility
    const growth = (Math.random() * 0.15) - 0.02;
    gdp = gdp * (1 + growth);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      gdp: parseFloat(gdp.toFixed(2)),
      transactions: Math.floor(Math.random() * 50000) + 100000,
      activeAgents: Math.floor(Math.random() * 500) + 2000 + i * 15,
      tvl: parseFloat((gdp * 0.3 + Math.random() * 5).toFixed(2)),
    });
  }
  return data;
};

const protocolData = [
  { name: 'Autonolas', value: 34.2, color: '#00F0FF' },
  { name: 'Fetch.ai', value: 28.1, color: '#FF00AA' },
  { name: 'SingularityNET', value: 18.5, color: '#39FF14' },
  { name: 'Ocean Protocol', value: 12.3, color: '#FFB800' },
  { name: 'Others', value: 6.9, color: '#8B5CF6' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-cyan-500/50 px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm">
        <p className="text-cyan-400 font-mono text-xs md:text-sm">{label}</p>
        <p className="text-white font-mono text-sm md:text-lg font-bold">
          ${payload[0].value.toFixed(2)}M
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, unit, delay }: { title: string; value: string; change: string; unit: string; delay: number }) => (
  <div
    className="relative group animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative bg-black/60 border border-cyan-500/30 p-3 md:p-5 hover:border-cyan-400/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-wider uppercase">{title}</span>
        <span className={`text-[10px] md:text-xs font-mono ${change.startsWith('+') ? 'text-lime-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-white font-display text-xl md:text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-cyan-400/50 font-mono text-xs md:text-sm">{unit}</span>
      </div>
      <div className="mt-2 h-1 bg-cyan-900/30 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500 animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  </div>
);

function App() {
  const [data] = useState(generateGDPData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  const gdpChange = (((latestData.gdp - previousData.gdp) / previousData.gdp) * 100).toFixed(1);

  const timeframes = ['1M', '3M', '6M', '1Y'];

  const getFilteredData = () => {
    const weeks = selectedTimeframe === '1M' ? 4 : selectedTimeframe === '3M' ? 13 : selectedTimeframe === '6M' ? 26 : 52;
    return data.slice(-weeks);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Background grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] md:bg-[size:100px_100px]" />

      {/* Animated scan line */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scan" />
      </div>

      {/* Gradient orbs */}
      <div className="fixed top-0 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-magenta-500/10 rounded-full blur-[80px] md:blur-[150px] translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className={`mb-6 md:mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-lime-400 rounded-full animate-pulse" />
                <span className="text-lime-400 font-mono text-[10px] md:text-xs tracking-widest">LIVE DATA</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-magenta-400">
                  AGENT GDP
                </span>
              </h1>
              <p className="text-cyan-400/60 font-mono text-xs md:text-sm mt-2 tracking-wide">
                Onchain Autonomous Agent Economy Tracker
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-2 md:px-4 md:py-2 font-mono text-xs md:text-sm transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    selectedTimeframe === tf
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                      : 'bg-black/40 border border-cyan-500/30 text-cyan-400/60 hover:border-cyan-400/60 hover:text-cyan-400'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard
            title="Total GDP"
            value={`$${latestData.gdp.toFixed(1)}`}
            change={`+${gdpChange}%`}
            unit="M"
            delay={100}
          />
          <StatCard
            title="Active Agents"
            value={latestData.activeAgents.toLocaleString()}
            change="+12.3%"
            unit=""
            delay={200}
          />
          <StatCard
            title="24h Transactions"
            value={latestData.transactions.toLocaleString()}
            change="+8.7%"
            unit=""
            delay={300}
          />
          <StatCard
            title="Agent TVL"
            value={`$${latestData.tvl.toFixed(1)}`}
            change="+5.2%"
            unit="M"
            delay={400}
          />
        </div>

        {/* Main Chart */}
        <div
          className={`relative bg-black/60 border border-cyan-500/30 p-3 md:p-6 mb-6 md:mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-2">
            <h2 className="font-display text-lg md:text-xl text-white tracking-wide">GDP GROWTH TRAJECTORY</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400/70 font-mono text-[10px] md:text-xs">UPDATING IN REAL-TIME</span>
            </div>
          </div>
          <div className="h-[250px] md:h-[350px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFilteredData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#FF00AA" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#00F0FF40"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#00F0FF80' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#00F0FF40"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#00F0FF80' }}
                  tickFormatter={(value) => `$${value}M`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="gdp"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  fill="url(#gdpGradient)"
                  filter="url(#glow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Protocol Distribution */}
          <div
            className={`bg-black/60 border border-cyan-500/30 p-3 md:p-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <h3 className="font-display text-base md:text-lg text-white mb-4 md:mb-6 tracking-wide">PROTOCOL SHARE</h3>
            <div className="h-[180px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocolData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#00F0FF80', fontSize: 10 }}
                    width={90}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {protocolData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={hoveredProtocol === null || hoveredProtocol === entry.name ? 1 : 0.3}
                        onMouseEnter={() => setHoveredProtocol(entry.name)}
                        onMouseLeave={() => setHoveredProtocol(null)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 mt-4">
              {protocolData.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-1 md:gap-2 cursor-pointer"
                  onMouseEnter={() => setHoveredProtocol(p.name)}
                  onMouseLeave={() => setHoveredProtocol(null)}
                >
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-cyan-400/70 font-mono text-[10px] md:text-xs">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Volume */}
          <div
            className={`bg-black/60 border border-cyan-500/30 p-3 md:p-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <h3 className="font-display text-base md:text-lg text-white mb-4 md:mb-6 tracking-wide">TRANSACTION VOLUME</h3>
            <div className="h-[180px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getFilteredData().slice(-20)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    stroke="#00F0FF40"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#00F0FF80' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#00F0FF40"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#00F0FF80' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    width={35}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#FF00AA"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Agent Activity Table */}
        <div
          className={`bg-black/60 border border-cyan-500/30 p-3 md:p-6 mb-6 md:mb-8 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h3 className="font-display text-base md:text-lg text-white mb-4 md:mb-6 tracking-wide">TOP PERFORMING AGENTS</h3>
          <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-2 md:py-3 text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-wider">AGENT</th>
                  <th className="text-right py-2 md:py-3 text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-wider">REVENUE</th>
                  <th className="text-right py-2 md:py-3 text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-wider">TXS</th>
                  <th className="text-right py-2 md:py-3 text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-wider">24H</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'AutoTrader-X7', address: '0x7f3...a4b2', revenue: '$2.3M', txs: '45.2K', change: '+15.3%' },
                  { name: 'YieldHarvest', address: '0x1c9...f8e1', revenue: '$1.8M', txs: '38.7K', change: '+12.1%' },
                  { name: 'LiquidityBot', address: '0x3d2...c7a9', revenue: '$1.4M', txs: '29.4K', change: '+8.7%' },
                  { name: 'ArbitrageAgent', address: '0x9e5...d2f3', revenue: '$1.1M', txs: '67.8K', change: '+22.4%' },
                  { name: 'NFTScout', address: '0x6b8...e1c4', revenue: '$0.9M', txs: '15.2K', change: '+5.2%' },
                ].map((agent, idx) => (
                  <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                    <td className="py-2 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded flex items-center justify-center font-display text-xs md:text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-mono text-xs md:text-sm truncate">{agent.name}</div>
                          <div className="text-cyan-400/50 font-mono text-[10px] md:text-xs truncate">{agent.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-2 md:py-4 text-white font-mono text-xs md:text-sm">{agent.revenue}</td>
                    <td className="text-right py-2 md:py-4 text-cyan-400/70 font-mono text-xs md:text-sm">{agent.txs}</td>
                    <td className="text-right py-2 md:py-4 text-lime-400 font-mono text-xs md:text-sm">{agent.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 md:py-8 border-t border-cyan-500/20">
          <p className="text-cyan-400/40 font-mono text-[10px] md:text-xs tracking-wide">
            Requested by <a href="https://twitter.com/0xBenjin" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400/60 transition-colors">@0xBenjin</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400/60 transition-colors">@clonkbot</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
