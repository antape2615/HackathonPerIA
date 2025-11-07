import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

// Import routes
import authRoutes from './routes/auth'
import assessmentRoutes from './routes/assessment'
import aiRoutes from './routes/ai'
import dashboardRoutes from './routes/dashboard'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
})

const prisma = new PrismaClient()
const PORT = process.env.PORT

app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Periscan AI Backend'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/assessment', authMiddleware, assessmentRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/dashboard', authMiddleware, dashboardRoutes)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('subscribe-to-user-updates', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`)
      console.log(`Client ${socket.id} subscribed to updates for user ${userId}`)
    }
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

app.use(errorHandler)

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

server.listen(PORT, () => {
  console.log(`🚀 Periscan AI Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

export { io, prisma }
