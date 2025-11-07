'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentAPI, aiAPI } from '@/services/api'

export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentAPI.getAll().then(res => res.data.data.assessments),
  })
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentAPI.getById(id).then(res => res.data.data.assessment),
    enabled: !!id,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { title: string; responses: any }) => 
      assessmentAPI.create(data).then(res => res.data.data.assessment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
  })
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      assessmentAPI.update(id, data).then(res => res.data.data.assessment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['assessment', id] })
    },
  })
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => assessmentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
  })
}

export function useAnalyzeAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (assessmentId: string) => 
      aiAPI.analyze(assessmentId).then(res => res.data.data),
    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] })
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
  })
}

export function useChatAI() {
  return useMutation({
    mutationFn: (data: { message: string; assessmentId?: string }) =>
      aiAPI.chat(data).then(res => res.data.data),
  })
}

export function useChatHistory(assessmentId: string) {
  return useQuery({
    queryKey: ['chatHistory', assessmentId],
    queryFn: () => aiAPI.getChatHistory(assessmentId).then(res => res.data.data.messages),
    enabled: !!assessmentId,
  });
}

export function useGenerateInsights() {
  return useMutation({
    mutationFn: (assessmentId: string) => 
      aiAPI.insights(assessmentId).then(res => res.data.data),
  })
}
