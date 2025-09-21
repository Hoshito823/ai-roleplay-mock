import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { scenarioId } = body

    if (!scenarioId) {
      return NextResponse.json(
        { error: 'Scenario ID is required' },
        { status: 400 }
      )
    }

    const scenario = await prisma.scenario.findUnique({
      where: { id: scenarioId, isActive: true }
    })

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
        scenarioId: scenarioId,
        status: 'ACTIVE'
      },
      include: {
        scenario: true
      }
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // 開発環境での認証バイパス - モックデータを返す
    const mockSessions = [
      {
        id: "1",
        scenario: "新規顧客開拓",
        duration: 15,
        successRate: 85,
        emotionScore: 8.5,
        createdAt: "2024-09-15T10:30:00Z",
        status: "completed"
      },
      {
        id: "2",
        scenario: "既存顧客フォロー",
        duration: 12,
        successRate: 78,
        emotionScore: 7.8,
        createdAt: "2024-09-14T14:20:00Z",
        status: "completed"
      },
      {
        id: "3",
        scenario: "クレーム対応",
        duration: 18,
        successRate: 65,
        emotionScore: 6.2,
        createdAt: "2024-09-13T11:15:00Z",
        status: "completed"
      },
      {
        id: "4",
        scenario: "商品提案",
        duration: 20,
        successRate: 92,
        emotionScore: 9.1,
        createdAt: "2024-09-12T16:45:00Z",
        status: "completed"
      },
      {
        id: "5",
        scenario: "価格交渉",
        duration: 8,
        successRate: 45,
        emotionScore: 5.5,
        createdAt: "2024-09-11T09:30:00Z",
        status: "failed"
      }
    ];

    return NextResponse.json(mockSessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}