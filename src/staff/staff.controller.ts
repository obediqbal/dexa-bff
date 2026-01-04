import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StaffService } from './staff.service';
import { RegisterStaffDto, RegisterStaffResponseDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post('register')
    async register(
        @Body() dto: RegisterStaffDto,
        @Req() req: Request,
    ): Promise<RegisterStaffResponseDto> {
        const authToken = this.extractToken(req);
        return this.staffService.register(dto, authToken);
    }

    private extractToken(req: Request): string {
        return req.cookies['access_token'] || '';
    }
}
