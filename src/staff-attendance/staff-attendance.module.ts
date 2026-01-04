import { Module } from '@nestjs/common';
import { StaffAttendanceController } from './staff-attendance.controller';
import { StaffAttendanceService } from './staff-attendance.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
    imports: [ClientsModule],
    controllers: [StaffAttendanceController],
    providers: [StaffAttendanceService],
})
export class StaffAttendanceModule { }
