import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffsClientService } from './staffs-client.service';
import { AttendanceClientService } from './attendance-client.service';
import { AuthClientService } from './auth-client.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [StaffsClientService, AttendanceClientService, AuthClientService],
    exports: [StaffsClientService, AttendanceClientService, AuthClientService],
})
export class ClientsModule { }

