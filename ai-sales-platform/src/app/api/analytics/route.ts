import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 開発環境でのモックデータ
    const mockAnalyticsData = {
      weeklyProgress: [
        { week: '第1週', sessions: 12, successRate: 75 },
        { week: '第2週', sessions: 18, successRate: 82 },
        { week: '第3週', sessions: 15, successRate: 78 },
        { week: '第4週', sessions: 23, successRate: 85 }
      ],
      emotionTrends: [
        { date: '2024-09-10', score: 7.2 },
        { date: '2024-09-11', score: 7.8 },
        { date: '2024-09-12', score: 8.1 },
        { date: '2024-09-13', score: 7.5 },
        { date: '2024-09-14', score: 8.3 },
        { date: '2024-09-15', score: 8.7 },
        { date: '2024-09-16', score: 8.2 }
      ],
      scenarioPerformance: [
        { scenario: '新規顧客開拓', successRate: 85, averageTime: 15 },
        { scenario: '既存顧客フォロー', successRate: 78, averageTime: 12 },
        { scenario: 'クレーム対応', successRate: 65, averageTime: 18 },
        { scenario: '商品提案', successRate: 92, averageTime: 20 },
        { scenario: '価格交渉', successRate: 45, averageTime: 8 }
      ]
    };

    return NextResponse.json(mockAnalyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}