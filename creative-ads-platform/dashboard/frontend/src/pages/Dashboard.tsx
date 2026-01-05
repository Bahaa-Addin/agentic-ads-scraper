import { useQuery } from '@tanstack/react-query'
import {
  Images,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { getDashboardMetrics, getJobs, getIndustryDistribution, getTimeSeries } from '@/lib/api'
import { formatNumber, formatDuration, formatRelativeTime, INDUSTRY_COLORS, formatIndustryName } from '@/lib/utils'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: getDashboardMetrics,
    refetchInterval: 10000,
  })

  const { data: recentJobs } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: () => getJobs({ page_size: 5 }),
    refetchInterval: 15000,
  })

  const { data: industryData } = useQuery({
    queryKey: ['industryDistribution'],
    queryFn: getIndustryDistribution,
  })

  const { data: throughputData } = useQuery({
    queryKey: ['throughputTimeSeries'],
    queryFn: () => getTimeSeries('assets_scraped', 24),
  })

  // Format time series data for Recharts
  const chartData = throughputData?.data.map((point) => ({
    time: format(parseISO(point.timestamp), 'HH:mm'),
    value: point.value,
  })) || []

  // Format pie chart data
  const pieData = industryData?.slice(0, 8).map((item) => ({
    name: formatIndustryName(item.industry),
    value: item.count,
    color: INDUSTRY_COLORS[item.industry] || '#6b7280',
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-surface-400 mt-1">
          Monitor your creative ads pipeline in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assets Scraped"
          value={metrics?.pipeline.assets_scraped || 0}
          icon={Images}
          color="blue"
          change={12.5}
          changeLabel="vs last week"
          loading={metricsLoading}
        />
        <StatCard
          title="Features Extracted"
          value={metrics?.pipeline.features_extracted || 0}
          icon={Sparkles}
          color="purple"
          change={8.3}
          changeLabel="vs last week"
          loading={metricsLoading}
        />
        <StatCard
          title="Prompts Generated"
          value={metrics?.pipeline.prompts_generated || 0}
          icon={MessageSquare}
          color="green"
          change={15.2}
          changeLabel="vs last week"
          loading={metricsLoading}
        />
        <StatCard
          title="Error Rate"
          value={`${metrics?.system.error_rate_percent?.toFixed(1) || 0}%`}
          icon={AlertCircle}
          color={metrics?.system.error_rate_percent > 5 ? 'red' : 'cyan'}
          change={-2.1}
          changeLabel="vs last week"
          loading={metricsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Throughput Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              Pipeline Throughput (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="time"
                    stroke="#71717a"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#27272a',
                      border: '1px solid #3f3f46',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Industry Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#27272a',
                      border: '1px solid #3f3f46',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-surface-400 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Pending Jobs</span>
                <span className="text-xl font-semibold text-white">
                  {formatNumber(metrics?.queue.pending_jobs || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">In Progress</span>
                <span className="text-xl font-semibold text-brand-400">
                  {formatNumber(metrics?.queue.in_progress_jobs || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Completed Today</span>
                <span className="text-xl font-semibold text-success-500">
                  {formatNumber(metrics?.queue.completed_jobs || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Failed</span>
                <span className="text-xl font-semibold text-danger-500">
                  {formatNumber(metrics?.queue.failed_jobs || 0)}
                </span>
              </div>
              <div className="pt-4 border-t border-surface-800">
                <div className="flex items-center justify-between">
                  <span className="text-surface-400">Avg Processing Time</span>
                  <span className="text-white font-medium">
                    {formatDuration(metrics?.queue.avg_processing_time_seconds || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-500" />
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentJobs?.jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {job.job_type.replace(/_/g, ' ')}
                      </p>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-surface-500 mt-1">
                      {job.source?.replace(/_/g, ' ') || 'System'} •{' '}
                      {formatRelativeTime(job.created_at)}
                    </p>
                  </div>
                  {job.assets_processed > 0 && (
                    <span className="text-sm text-surface-400">
                      {job.assets_processed} assets
                    </span>
                  )}
                </div>
              ))}
              {!recentJobs?.jobs.length && (
                <p className="text-center text-surface-500 py-4">
                  No recent jobs
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

