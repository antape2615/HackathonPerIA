import {apiClient} from '@/shared/api/client';
import {API_ENDPOINTS} from '@/shared/utils/constants';
import {AuthResponse, LoginCredentials, RegisterData} from '../types/auth.types';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
    }

    async logout(): Promise<void> {
        return apiClient.post(API_ENDPOINTS.LOGOUT);
    }

    async me(): Promise<AuthResponse['user']> {
        return apiClient.get(API_ENDPOINTS.ME);
    }
}

export const authService = new AuthService();
