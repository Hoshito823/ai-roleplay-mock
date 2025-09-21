import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertJapaneseToDifficultyEnum } from '@/utils/difficulty'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const difficulty = searchParams.get('difficulty')

    const difficultyEnum = difficulty ? convertJapaneseToDifficultyEnum(difficulty) : null

    const scenarios = await prisma.scenario.findMany({
      where: {
        isActive: true,
        ...(industry && { industry }),
        ...(difficultyEnum && { difficulty: difficultyEnum })
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

    const difficultyEnum = convertJapaneseToDifficultyEnum(difficulty)
    if (!difficultyEnum) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    const scenario = await prisma.scenario.create({
      data: {
        title,
        description,
        industry,
        difficulty: difficultyEnum
      }
    })

    return NextResponse.json(scenario, { status: 201 })
  } catch (error) {
    console.error('Error creating scenario:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}