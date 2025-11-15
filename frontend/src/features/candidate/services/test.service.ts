import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/utils/constants';
import {
    Test,
    TestDetail,
    TestSession,
    Answer,
    SubmitAnswerData,
    SessionResults,
} from '../types/test.types';

class TestService {
    async getAvailableTests(): Promise<Test[]> {
        return apiClient.get<Test[]>(API_ENDPOINTS.TESTS);
    }

    async getTestById(id: string): Promise<TestDetail> {
        return apiClient.get<TestDetail>(API_ENDPOINTS.TEST_BY_ID(id));
    }

    async getSession(sessionId: string): Promise<TestSession> {
        return apiClient.get<TestSession>(API_ENDPOINTS.GET_SESSION(sessionId));
    }

    async startTest(testId: string): Promise<TestSession> {
        return apiClient.post<TestSession>(API_ENDPOINTS.START_TEST(testId));
    }

    async submitAnswer(data: SubmitAnswerData): Promise<Answer> {
        return apiClient.post<Answer>(API_ENDPOINTS.SUBMIT_ANSWER, data);
    }

    async finishTest(sessionId: string): Promise<void> {
        return apiClient.post(API_ENDPOINTS.FINISH_TEST(sessionId));
    }

    async getSessionResults(sessionId: string): Promise<SessionResults> {
        return apiClient.get<SessionResults>(API_ENDPOINTS.SESSION_RESULTS(sessionId));
    }

    async getMySessions(): Promise<TestSession[]> {
        return apiClient.get<TestSession[]>(API_ENDPOINTS.MY_SESSIONS);
    }

}

export const testService = new TestService();