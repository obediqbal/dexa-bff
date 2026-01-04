import { Staff } from '../../clients/staffs-client.service';
import { Attendance } from '../../clients/attendance-client.service';

export class AttendanceWithStaffDto {
    // Attendance fields
    id: string;
    staffId: string;
    clockIn: string;
    clockOut: string | null;
    clockInPhotoUrl: string | null;
    clockOutPhotoUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;

    // Embedded staff
    staff: Staff;

    constructor(attendance: Attendance, staff: Staff) {
        this.id = attendance.id;
        this.staffId = attendance.staffId;
        this.clockIn = attendance.clockIn;
        this.clockOut = attendance.clockOut;
        this.clockInPhotoUrl = attendance.clockInPhotoUrl;
        this.clockOutPhotoUrl = attendance.clockOutPhotoUrl;
        this.notes = attendance.notes;
        this.createdAt = attendance.createdAt;
        this.updatedAt = attendance.updatedAt;
        this.staff = staff;
    }
}

export class PaginatedStaffAttendanceResponseDto {
    data: AttendanceWithStaffDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };

    constructor(
        data: AttendanceWithStaffDto[],
        total: number,
        page: number,
        limit: number,
    ) {
        this.data = data;
        this.meta = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
