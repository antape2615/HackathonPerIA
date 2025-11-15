import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/utils/constants';
import { Test, CreateTestDTO } from '@/shared/types';
import { EvaluatorStats } from '../types/evaluator.types';

class EvaluatorService {
  async getTests(): Promise<Test[]> {
    return apiClient.get<Test[]>(API_ENDPOINTS.TESTS);
  }

  async getTestById(id: string): Promise<Test> {
    return apiClient.get<Test>(API_ENDPOINTS.TEST_BY_ID(id));
  }

  async createTest(data: CreateTestDTO): Promise<Test> {
    return apiClient.post<Test>(API_ENDPOINTS.TESTS, data);
  }

  async updateTest(id: string, data: Partial<CreateTestDTO>): Promise<Test> {
    return apiClient.put<Test>(API_ENDPOINTS.TEST_BY_ID(id), data);
  }

  async deleteTest(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.TEST_BY_ID(id));
  }

  async publishTest(id: string): Promise<Test> {
    return apiClient.post<Test>(API_ENDPOINTS.PUBLISH_TEST(id));
  }

  async getStats(): Promise<EvaluatorStats> {
    return apiClient.get<EvaluatorStats>(API_ENDPOINTS.EVALUATOR_STATS);
  }
}

export const evaluatorService = new EvaluatorService();
