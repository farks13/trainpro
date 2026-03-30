import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const exercises = await prisma.exercise.findMany({ orderBy: [{ primaryMuscleGroup: "asc" }, { name: "asc" }] })
  return NextResponse.json(exercises)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const exercise = await prisma.exercise.create({
      data: {
        name: body.name,
        primaryMuscleGroup: body.muscleGroup ?? body.primaryMuscleGroup ?? "Other",
        equipment: body.equipment ?? "Bodyweight",
        instructions: body.description ?? "",
      },
    })
    return NextResponse.json(exercise, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
