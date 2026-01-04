import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface RegisterRequest {
    staffId: string;
    email: string;
    password: string;
    role: 'STAFF' | 'ADMIN';
}

export interface AuthResponse {
    id: string;
    staffId: string;
    email: string;
    role: string;
}

@Injectable()
export class AuthClientService {
    private readonly logger = new Logger(AuthClientService.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
    }

    async register(data: RegisterRequest, authToken: string): Promise<AuthResponse> {
        const url = `${this.baseUrl}/api/v1/auth/register`;
        this.logger.debug(`Registering user for staffId: ${data.staffId}`);

        try {
            const response = await firstValueFrom(
                this.httpService.post<AuthResponse>(url, data, {
                    headers: {
                        Cookie: `access_token=${authToken}`,
                    },
                }),
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                throw new HttpException(
                    error.response.data?.message || 'Auth service error',
                    error.response.status,
                );
            }
            throw error;
        }
    }
}
