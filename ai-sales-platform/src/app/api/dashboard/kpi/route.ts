import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    // 開発環境でのモックデータ
    const mockKpiData = {
      successRate: 78.5,
      averageSessionTime: 15.2,
      emotionScore: 7.8,
      totalSessions: 23,
      completedSessions: 18
    };

    return NextResponse.json(mockKpiData)
  } catch (error) {
    console.error('Error fetching KPI data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}