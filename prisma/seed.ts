import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Upsert the default user
  const user = await prisma.user.upsert({
    where: { email: "steve@trainpro.app" },
    update: {},
    create: {
      id: "user_steve",
      name: "Steve",
      email: "steve@trainpro.app",
      weeklyWorkoutTarget: 5,
    },
  })
  console.log("✅ User:", user.name)

  // Exercises
  const exercises = [
    { name: "Barbell Bench Press", primaryMuscleGroup: "Chest", equipment: "Barbell", instructions: "Lie on bench, lower bar to chest, press up", mediaUrl: "https://www.youtube.com/watch?v=vcBig73ojpE" },
    { name: "Incline Dumbbell Press", primaryMuscleGroup: "Chest", equipment: "Dumbbell", instructions: "Set bench to 30-45°, press dumbbells up", mediaUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
    { name: "Barbell Back Squat", primaryMuscleGroup: "Quads", equipment: "Barbell", instructions: "Bar on traps, squat to parallel, drive up", mediaUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
    { name: "Romanian Deadlift", primaryMuscleGroup: "Hamstrings", equipment: "Barbell", instructions: "Hinge at hips, lower bar down shins, return", mediaUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
    { name: "Pull-Up", primaryMuscleGroup: "Back", equipment: "Bodyweight", instructions: "Hang from bar, pull chin over bar", mediaUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
    { name: "Barbell Row", primaryMuscleGroup: "Back", equipment: "Barbell", instructions: "Hinge forward, row bar to lower chest", mediaUrl: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ" },
    { name: "Overhead Press", primaryMuscleGroup: "Shoulders", equipment: "Barbell", instructions: "Press bar from shoulder height overhead", mediaUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDI" },
    { name: "Lateral Raise", primaryMuscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Raise dumbbells to shoulder height laterally", mediaUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
    { name: "Barbell Curl", primaryMuscleGroup: "Biceps", equipment: "Barbell", instructions: "Curl bar from hip to shoulder", mediaUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo" },
    { name: "Tricep Pushdown", primaryMuscleGroup: "Triceps", equipment: "Cable", instructions: "Push cable attachment down, extending elbows", mediaUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU" },
    { name: "Leg Press", primaryMuscleGroup: "Quads", equipment: "Machine", instructions: "Press platform away, don't lock knees", mediaUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
    { name: "Hip Thrust", primaryMuscleGroup: "Glutes", equipment: "Barbell", instructions: "Shoulders on bench, drive hips up", mediaUrl: "https://www.youtube.com/watch?v=xDmFkJxPzeM" },
  ]

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: { mediaUrl: ex.mediaUrl },
      create: ex,
    })
  }
  console.log(`✅ ${exercises.length} exercises seeded`)

  // Fetch exercises by name to get their IDs
  const exMap: Record<string, string> = {}
  for (const ex of exercises) {
    const record = await prisma.exercise.findUnique({ where: { name: ex.name } })
    if (record) exMap[ex.name] = record.id
  }

  // Program
  const program = await prisma.program.upsert({
    where: { id: "prog_push_pull_legs" },
    update: {},
    create: {
      id: "prog_push_pull_legs",
      userId: user.id,
      name: "Push / Pull / Legs",
      description: "Classic 3-day split focusing on compound movements",
      isActive: true,
    },
  })
  console.log("✅ Program:", program.name)

  // Push Day template
  await prisma.workoutTemplate.upsert({
    where: { id: "tmpl_push" },
    update: {},
    create: {
      id: "tmpl_push",
      programId: "prog_push_pull_legs",
      name: "Push Day",
      focus: "Chest, Shoulders, Triceps",
      muscleGroups: JSON.stringify(["Chest", "Shoulders", "Triceps"]),
      orderIndex: 0,
    },
  })

  const pushExercises = [
    { id: "wte_push_bench",    name: "Barbell Bench Press",   sets: 4, min: 8,  max: 12, rir: 2, order: 0 },
    { id: "wte_push_incline",  name: "Incline Dumbbell Press", sets: 3, min: 10, max: 15, rir: 2, order: 1 },
    { id: "wte_push_ohp",      name: "Overhead Press",         sets: 3, min: 10, max: 15, rir: 2, order: 2 },
    { id: "wte_push_lateral",  name: "Lateral Raise",          sets: 3, min: 15, max: 20, rir: 2, order: 3 },
    { id: "wte_push_pushdown", name: "Tricep Pushdown",        sets: 3, min: 12, max: 15, rir: 2, order: 4 },
  ]
  for (const ex of pushExercises) {
    await prisma.workoutTemplateExercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        workoutTemplateId: "tmpl_push",
        exerciseId: exMap[ex.name],
        orderIndex: ex.order,
        prescribedSets: ex.sets,
        repRangeMin: ex.min,
        repRangeMax: ex.max,
        rirTarget: ex.rir,
        notes: "",
      },
    })
  }
  console.log("✅ Push Day template seeded with", pushExercises.length, "exercises")

  // Pull Day template
  await prisma.workoutTemplate.upsert({
    where: { id: "tmpl_pull" },
    update: {},
    create: {
      id: "tmpl_pull",
      programId: "prog_push_pull_legs",
      name: "Pull Day",
      focus: "Back, Biceps",
      muscleGroups: JSON.stringify(["Back", "Biceps"]),
      orderIndex: 1,
    },
  })

  const pullExercises = [
    { id: "wte_pull_pullup", name: "Pull-Up",      sets: 4, min: 6,  max: 10, rir: 2, order: 0 },
    { id: "wte_pull_row",    name: "Barbell Row",  sets: 4, min: 8,  max: 12, rir: 2, order: 1 },
    { id: "wte_pull_curl",   name: "Barbell Curl", sets: 3, min: 10, max: 15, rir: 2, order: 2 },
  ]
  for (const ex of pullExercises) {
    await prisma.workoutTemplateExercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        workoutTemplateId: "tmpl_pull",
        exerciseId: exMap[ex.name],
        orderIndex: ex.order,
        prescribedSets: ex.sets,
        repRangeMin: ex.min,
        repRangeMax: ex.max,
        rirTarget: ex.rir,
        notes: "",
      },
    })
  }
  console.log("✅ Pull Day template seeded with", pullExercises.length, "exercises")

  // Legs Day template
  await prisma.workoutTemplate.upsert({
    where: { id: "tmpl_legs" },
    update: {},
    create: {
      id: "tmpl_legs",
      programId: "prog_push_pull_legs",
      name: "Legs Day",
      focus: "Quads, Hamstrings, Glutes",
      muscleGroups: JSON.stringify(["Quads", "Hamstrings", "Glutes"]),
      orderIndex: 2,
    },
  })

  const legsExercises = [
    { id: "wte_legs_squat", name: "Barbell Back Squat",  sets: 4, min: 6,  max: 10, rir: 2, order: 0 },
    { id: "wte_legs_rdl",   name: "Romanian Deadlift",   sets: 3, min: 10, max: 15, rir: 2, order: 1 },
    { id: "wte_legs_press", name: "Leg Press",            sets: 3, min: 10, max: 15, rir: 2, order: 2 },
    { id: "wte_legs_thrust",name: "Hip Thrust",           sets: 3, min: 10, max: 15, rir: 2, order: 3 },
  ]
  for (const ex of legsExercises) {
    await prisma.workoutTemplateExercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        workoutTemplateId: "tmpl_legs",
        exerciseId: exMap[ex.name],
        orderIndex: ex.order,
        prescribedSets: ex.sets,
        repRangeMin: ex.min,
        repRangeMax: ex.max,
        rirTarget: ex.rir,
        notes: "",
      },
    })
  }
  console.log("✅ Legs Day template seeded with", legsExercises.length, "exercises")

  console.log("🎉 Seed complete!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
