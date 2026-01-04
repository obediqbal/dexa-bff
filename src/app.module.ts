import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StaffAttendanceModule } from './staff-attendance/staff-attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StaffAttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
