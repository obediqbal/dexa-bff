import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffsClientService } from './staffs-client.service';
import { AttendanceClientService } from './attendance-client.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [StaffsClientService, AttendanceClientService],
    exports: [StaffsClientService, AttendanceClientService],
})
export class ClientsModule { }
