"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalyticsData {
  emotionTrend: { date: string; score: number }[];
  sessionStats: { month: string; sessions: number; successRate: number }[];
}

export function AnalyticsCharts() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        // フォールバックデータ
        setAnalyticsData({
          emotionTrend: [
            { date: "1月", score: 7.2 },
            { date: "2月", score: 7.8 },
            { date: "3月", score: 8.1 },
            { date: "4月", score: 8.5 },
            { date: "5月", score: 8.2 },
            { date: "6月", score: 8.7 }
          ],
          sessionStats: [
            { month: "1月", sessions: 45, successRate: 68 },
            { month: "2月", sessions: 52, successRate: 72 },
            { month: "3月", sessions: 48, successRate: 75 },
            { month: "4月", sessions: 61, successRate: 78 },
            { month: "5月", sessions: 58, successRate: 82 },
            { month: "6月", sessions: 67, successRate: 85 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 感情スコア推移 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">感情スコア推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData?.emotionTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="感情スコア"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* セッション統計 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">月別セッション統計</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData?.sessionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="sessions"
              fill="#3b82f6"
              name="セッション数"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="successRate"
              stroke="#10b981"
              strokeWidth={2}
              name="成功率 (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}