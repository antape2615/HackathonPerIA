import express from 'express'
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'

const prisma = new PrismaClient()
const io = new Server()
import { z } from 'zod'

const router = express.Router()

const assessmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  responses: z.object({
    company: z.string(),
    industry: z.string(),
    size: z.string(),
    currentChallenges: z.array(z.string()),
    digitalMaturity: z.string(),
    budget: z.string(),
    timeline: z.string(),
    priorities: z.array(z.string())
  })
})

// Create new assessment
router.post('/', async (req, res) => {
  try {
    const { title, responses } = assessmentSchema.parse(req.body)
    const userId = (req as any).user.id

    const assessment = await prisma.assessment.create({
      data: {
        title,
        responses,
        userId,
        status: 'DRAFT'
      }
    })

    // Emit real-time update
    io.to(`user-${userId}`).emit('assessment-created', assessment)

    res.status(201).json({
      success: true,
      data: { assessment }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      })
    }

    console.error('Create assessment error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get user assessments
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.id

    const assessments = await prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { sessions: true }
        }
      }
    })

    res.json({
      success: true,
      data: { assessments }
    })
  } catch (error) {
    console.error('Get assessments error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single assessment
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const assessment = await prisma.assessment.findFirst({
      where: {
        id,
        userId
      },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    res.json({
      success: true,
      data: { assessment }
    })
  } catch (error) {
    console.error('Get assessment error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update assessment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    const { title, responses, status } = req.body

    const assessment = await prisma.assessment.findFirst({
      where: { id, userId }
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(responses && { responses }),
        ...(status && { status })
      }
    })

    // Emit real-time update
    io.to(`user-${userId}`).emit('assessment-updated', updatedAssessment)

    res.json({
      success: true,
      data: { assessment: updatedAssessment }
    })
  } catch (error) {
    console.error('Update assessment error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete assessment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const assessment = await prisma.assessment.findFirst({
      where: { id, userId }
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    await prisma.assessment.delete({
      where: { id }
    })

    // Emit real-time update
    io.to(`user-${userId}`).emit('assessment-deleted', { id })

    res.json({
      success: true,
      message: 'Assessment deleted successfully'
    })
  } catch (error) {
    console.error('Delete assessment error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
