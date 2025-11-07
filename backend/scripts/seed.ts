import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  console.log(`Created user: ${user.name} (${user.email})`)

  // Create assessments
  await prisma.assessment.create({
    data: {
      userId: user.id,
      title: 'Assessment Completo (Analizado)',
      status: 'ANALYZED',
      responses: {
        company: 'Tech Solutions Inc.',
        industry: 'Technology',
        size: 'medium',
        currentChallenges: ['Automatización de procesos', 'Análisis de datos'],
        digitalMaturity: 'advanced',
        budget: 'high',
        timeline: 'medium',
        priorities: ['Mejorar eficiencia', 'Innovación tecnológica'],
      },
      analysis: {
        painPoints: [{ title: 'Falta de integración entre sistemas', priority: 'Alta', impact: '78%', category: 'Tecnología' }],
        solutions: { shortTerm: [{ title: 'Dashboard de métricas básicas', cost: '$8,000', roi: '15%' }] },
        analytics: { averageROI: 150, timeSaved: 80 },
        recommendations: [{ title: 'Implementar dashboard de métricas en tiempo real', category: 'Estratégica' }]
      }
    },
  })

  await prisma.assessment.create({
    data: {
      userId: user.id,
      title: 'Assessment Pendiente de Análisis',
      status: 'COMPLETED',
      responses: {
        company: 'Retail Group',
        industry: 'Retail',
        size: 'large',
        currentChallenges: ['Experiencia del cliente', 'Costos operativos'],
        digitalMaturity: 'intermediate',
        budget: 'medium',
        timeline: 'short',
        priorities: ['Mejorar experiencia del cliente', 'Reducir costos'],
      },
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
