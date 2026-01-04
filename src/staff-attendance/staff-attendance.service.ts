import { Injectable, Logger } from '@nestjs/common';
import { StaffsClientService, Staff } from '../clients/staffs-client.service';
import { AttendanceClientService, Attendance } from '../clients/attendance-client.service';
import { StaffAttendanceQueryDto, AttendanceWithStaffDto, PaginatedStaffAttendanceResponseDto } from './dto';
import { STAFF_SORT_FIELDS, STAFF_FILTER_FIELDS } from './constants';

@Injectable()
export class StaffAttendanceService {
    private readonly logger = new Logger(StaffAttendanceService.name);

    constructor(
        private readonly staffsClient: StaffsClientService,
        private readonly attendanceClient: AttendanceClientService,
    ) { }

    async findAll(
        query: StaffAttendanceQueryDto,
        authToken: string,
    ): Promise<PaginatedStaffAttendanceResponseDto> {
        const { staffFilter, attendanceFilter } = this.splitFilter(query);
        const isStaffSort = (STAFF_SORT_FIELDS as readonly string[]).includes(query.sortBy || '');

        if (isStaffSort) {
            return this.findAllSortedByStaff(query, staffFilter, attendanceFilter, authToken);
        } else {
            return this.findAllSortedByAttendance(query, staffFilter, attendanceFilter, authToken);
        }
    }

    private async findAllSortedByStaff(
        query: StaffAttendanceQueryDto,
        staffFilter: Record<string, unknown>,
        attendanceFilter: { clockInStart?: string; clockInEnd?: string; clockOutStart?: string; clockOutEnd?: string },
        authToken: string,
    ): Promise<PaginatedStaffAttendanceResponseDto> {
        const staffsResponse = await this.staffsClient.findAll(
            {
                ids: query.staffIds,
                filterBy: Object.keys(staffFilter).length > 0 ? staffFilter : undefined,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                limit: 1000,
            },
            authToken,
        );

        if (staffsResponse.data.length === 0) {
            return new PaginatedStaffAttendanceResponseDto([], 0, query.page || 1, query.limit || 10);
        }

        const staffIds = staffsResponse.data.map((s) => s.id);
        const attendancesResponse = await this.attendanceClient.findAll(
            {
                staffIds,
                ...attendanceFilter,
                page: query.page,
                limit: query.limit,
            },
            authToken,
        );

        const staffMap = new Map(staffsResponse.data.map((s) => [s.id, s]));
        const data = attendancesResponse.data
            .filter((a) => staffMap.has(a.staffId))
            .map((a) => new AttendanceWithStaffDto(a, staffMap.get(a.staffId)!));

        return new PaginatedStaffAttendanceResponseDto(
            data,
            attendancesResponse.meta.total,
            attendancesResponse.meta.page,
            attendancesResponse.meta.limit,
        );
    }

    private async findAllSortedByAttendance(
        query: StaffAttendanceQueryDto,
        staffFilter: Record<string, unknown>,
        attendanceFilter: { clockInStart?: string; clockInEnd?: string; clockOutStart?: string; clockOutEnd?: string },
        authToken: string,
    ): Promise<PaginatedStaffAttendanceResponseDto> {
        const attendancesResponse = await this.attendanceClient.findAll(
            {
                staffIds: query.staffIds,
                ...attendanceFilter,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                page: query.page,
                limit: query.limit,
            },
            authToken,
        );

        if (attendancesResponse.data.length === 0) {
            return new PaginatedStaffAttendanceResponseDto([], 0, query.page || 1, query.limit || 10);
        }

        const staffIds = [...new Set(attendancesResponse.data.map((a) => a.staffId))];
        const staffsResponse = await this.staffsClient.findAll(
            {
                ids: staffIds,
                filterBy: Object.keys(staffFilter).length > 0 ? staffFilter : undefined,
            },
            authToken,
        );

        const staffMap = new Map(staffsResponse.data.map((s) => [s.id, s]));
        const data = attendancesResponse.data
            .filter((a) => staffMap.has(a.staffId))
            .map((a) => new AttendanceWithStaffDto(a, staffMap.get(a.staffId)!));

        return new PaginatedStaffAttendanceResponseDto(
            data,
            attendancesResponse.meta.total,
            attendancesResponse.meta.page,
            attendancesResponse.meta.limit,
        );
    }

    private splitFilter(query: StaffAttendanceQueryDto): {
        staffFilter: Record<string, unknown>;
        attendanceFilter: { clockInStart?: string; clockInEnd?: string; clockOutStart?: string; clockOutEnd?: string };
    } {
        const staffFilter: Record<string, unknown> = {};
        const attendanceFilter: { clockInStart?: string; clockInEnd?: string; clockOutStart?: string; clockOutEnd?: string } = {};

        for (const field of STAFF_FILTER_FIELDS) {
            const value = query[field as keyof StaffAttendanceQueryDto];
            if (value !== undefined && value !== null && value !== '') {
                staffFilter[field] = value;
            }
        }

        if (query.clockInStart) attendanceFilter.clockInStart = query.clockInStart;
        if (query.clockInEnd) attendanceFilter.clockInEnd = query.clockInEnd;
        if (query.clockOutStart) attendanceFilter.clockOutStart = query.clockOutStart;
        if (query.clockOutEnd) attendanceFilter.clockOutEnd = query.clockOutEnd;

        return { staffFilter, attendanceFilter };
    }
}
