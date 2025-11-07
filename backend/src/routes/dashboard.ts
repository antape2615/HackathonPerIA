import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { geminiService } from '../services/geminiService'

const router = express.Router()

// Get dashboard data
router.get('/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params
    const userId = (req as any).user.id

    let assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, userId }
    })
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    // If analysis is not present, generate it
    if (!assessment.analytics) {
      const analysisData = await geminiService.analyzeAssessment(assessment.responses)
      
      if (analysisData && typeof analysisData === 'object' && Object.keys(analysisData).length > 0) {
        assessment = await prisma.assessment.update({
          where: { id: assessmentId },
          data: {
            analysis: analysisData,
            painPoints: analysisData.painPoints || [],
            solutions: analysisData.solutions || {},
            analytics: analysisData.analytics || {},
            recommendations: analysisData.recommendations || [],
            status: 'ANALYZED'
          }
        });
      }
    }

    res.json({
      success: true,
      data: { assessment }
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard data'
    })
  }
})

export default router
