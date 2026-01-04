import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface Attendance {
    id: string;
    staffId: string;
    clockIn: string;
    clockOut: string | null;
    clockInPhotoUrl: string | null;
    clockOutPhotoUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AttendanceResponse {
    data: Attendance[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AttendanceQueryParams {
    page?: number;
    limit?: number;
    staffIds?: string[];
    clockInStart?: string;
    clockInEnd?: string;
    clockOutStart?: string;
    clockOutEnd?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filterBy?: Record<string, unknown>;
}

@Injectable()
export class AttendanceClientService {
    private readonly logger = new Logger(AttendanceClientService.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('ATTENDANCE_SERVICE_URL') || 'http://localhost:3001';
    }

    async findAll(params: AttendanceQueryParams, authToken: string): Promise<AttendanceResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.staffIds?.length) queryParams.append('staffIds', params.staffIds.join(','));
        if (params.clockInStart) queryParams.append('clockInStart', params.clockInStart);
        if (params.clockInEnd) queryParams.append('clockInEnd', params.clockInEnd);
        if (params.clockOutStart) queryParams.append('clockOutStart', params.clockOutStart);
        if (params.clockOutEnd) queryParams.append('clockOutEnd', params.clockOutEnd);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.filterBy && Object.keys(params.filterBy).length > 0) {
            queryParams.append('filterBy', JSON.stringify(params.filterBy));
        }

        const url = `${this.baseUrl}/api/v1/attendance/admin/all?${queryParams.toString()}`;
        this.logger.debug(`Fetching attendances: ${url}`);

        const response = await firstValueFrom(
            this.httpService.get<AttendanceResponse>(url, {
                headers: {
                    Cookie: `access_token=${authToken}`,
                },
            }),
        );

        return response.data;
    }
}
