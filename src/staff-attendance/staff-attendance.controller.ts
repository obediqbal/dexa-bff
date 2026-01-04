import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StaffAttendanceService } from './staff-attendance.service';
import { StaffAttendanceQueryDto, PaginatedStaffAttendanceResponseDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/staff-attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StaffAttendanceController {
    constructor(private readonly staffAttendanceService: StaffAttendanceService) { }

    @Get()
    async findAll(
        @Query() query: StaffAttendanceQueryDto,
        @Req() req: Request,
    ): Promise<PaginatedStaffAttendanceResponseDto> {
        const authToken = this.extractToken(req);
        return this.staffAttendanceService.findAll(query, authToken);
    }

    private extractToken(req: Request): string {
        return req.cookies['access_token'] || '';
    }
}
