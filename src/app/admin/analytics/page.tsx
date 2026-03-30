import { getDailyRevenue, getWeeklyVolume, getPopularServices, getDashboardStats } from '@/lib/actions/analytics'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [dailyRevenue, weeklyVolume, popularServices, stats] = await Promise.all([
    getDailyRevenue(7),
    getWeeklyVolume(),
    getPopularServices(),
    getDashboardStats(),
  ])

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Analitik</h1>
        <p className="text-slate-500 text-sm">Laporan kinerja bisnis</p>
      </div>
      <AnalyticsDashboard
        dailyRevenue={dailyRevenue}
        weeklyVolume={weeklyVolume}
        popularServices={popularServices}
        stats={stats}
      />
    </div>
  )
}
