import express from 'express'
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'

const prisma = new PrismaClient()
const io = new Server()
import { geminiService } from '../services/geminiService'
import { z } from 'zod'

const router = express.Router()

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  assessmentId: z.string().optional()
})

// Analyze assessment with AI
router.post('/analyze/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params
    const userId = (req as any).user.id

    // Get assessment
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        userId
      }
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    // Analyze with Gemini
    const analysis = await geminiService.analyzeAssessment(assessment.responses as any)

    // Update assessment with analysis
    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        analysis,
        status: 'ANALYZED'
      }
    })

    // Create analysis session
    await prisma.session.create({
      data: {
        assessmentId,
        userId,
        type: 'ANALYSIS',
        messages: [{ role: 'system', content: 'Analysis completed' }],
        aiAnalysis: analysis
      }
    })

    // Emit real-time update
    io.to(`user-${userId}`).emit('analysis-completed', {
      assessmentId,
      analysis
    })

    res.json({
      success: true,
      data: {
        assessment: updatedAssessment,
        analysis
      }
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    res.status(500).json({
      success: false,
      error: 'Error analyzing assessment with AI'
    })
  }
})

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, assessmentId } = chatSchema.parse(req.body)
    const userId = (req as any).user.id

    let context = {}
    if (assessmentId) {
      const assessment = await prisma.assessment.findFirst({
        where: { id: assessmentId, userId }
      })
      if (assessment) {
        context = assessment as any
      }
    }

    const aiResponse = await geminiService.generateChatResponse(message, context)

    if (assessmentId) {
      const session = await prisma.session.findFirst({
        where: { assessmentId, userId, type: 'CHAT' },
      });

      const newUserMessage = { role: 'user', content: message };
      const newAssistantMessage = { role: 'assistant', content: aiResponse };

      if (session) {
        // Append messages to existing session
        const updatedMessages = (session.messages as any[]).concat([newUserMessage, newAssistantMessage]);
        await prisma.session.update({
          where: { id: session.id },
          data: { messages: updatedMessages },
        });
      } else {
        // Create a new session
        await prisma.session.create({
          data: {
            assessmentId,
            userId,
            type: 'CHAT',
            messages: [newUserMessage, newAssistantMessage],
          },
        });
      }
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      })
    }

    console.error('AI chat error:', error)
    res.status(500).json({
      success: false,
      error: 'Error processing chat message'
    })
  }
})

// Get chat history
router.get('/chat/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = (req as any).user.id;

    const session = await prisma.session.findFirst({
      where: {
        assessmentId,
        userId,
        type: 'CHAT',
      },
    });

    if (session) {
      res.json({
        success: true,
        data: {
          messages: session.messages,
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          messages: [],
        },
      });
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching chat history',
    });
  }
});

// Generate insights
router.post('/insights/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params
    const userId = (req as any).user.id

    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, userId }
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    const insights = await geminiService.generateInsights(assessment.responses)

    res.json({
      success: true,
      data: { insights }
    })
  } catch (error) {
    console.error('AI insights error:', error)
    res.status(500).json({
      success: false,
      error: 'Error generating insights'
    })
  }
})

export default router
