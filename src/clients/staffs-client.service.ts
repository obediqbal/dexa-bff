import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface Staff {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    hireDate: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StaffResponse {
    data: Staff[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface StaffQueryParams {
    page?: number;
    limit?: number;
    ids?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filterBy?: Record<string, unknown>;
}

@Injectable()
export class StaffsClientService {
    private readonly logger = new Logger(StaffsClientService.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('STAFFS_SERVICE_URL') || 'http://localhost:3000';
    }

    async findAll(params: StaffQueryParams, authToken: string): Promise<StaffResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.ids?.length) queryParams.append('ids', params.ids.join(','));
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.filterBy && Object.keys(params.filterBy).length > 0) {
            queryParams.append('filterBy', JSON.stringify(params.filterBy));
        }

        const url = `${this.baseUrl}/api/v1/staff?${queryParams.toString()}`;
        this.logger.debug(`Fetching staffs: ${url}`);

        const response = await firstValueFrom(
            this.httpService.get<StaffResponse>(url, {
                headers: { Authorization: `Bearer ${authToken}` },
            }),
        );

        return response.data;
    }
}
