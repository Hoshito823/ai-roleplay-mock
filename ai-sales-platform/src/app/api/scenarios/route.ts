import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const difficulty = searchParams.get('difficulty')

    const scenarios = await prisma.scenario.findMany({
      where: {
        isActive: true,
        ...(industry && { industry }),
        ...(difficulty && { difficulty: difficulty as "初級" | "中級" | "上級" })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, industry, difficulty } = body

    if (!title || !industry || !difficulty) {
      return NextResponse.json(
        { error: 'Title, industry, and difficulty are required' },
        { status: 400 }
      )
    }

    const scenario = await prisma.scenario.create({
      data: {
        title,
        description,
        industry,
        difficulty
      }
    })

    return NextResponse.json(scenario, { status: 201 })
  } catch (error) {
    console.error('Error creating scenario:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}