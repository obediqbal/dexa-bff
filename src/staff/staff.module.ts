import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
    imports: [ClientsModule],
    controllers: [StaffController],
    providers: [StaffService],
})
export class StaffModule { }
