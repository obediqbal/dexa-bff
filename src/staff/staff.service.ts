import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { StaffsClientService, CreateStaffRequest } from '../clients/staffs-client.service';
import { AuthClientService, RegisterRequest } from '../clients/auth-client.service';
import { RegisterStaffDto, RegisterStaffResponseDto } from './dto';

@Injectable()
export class StaffService {
    private readonly logger = new Logger(StaffService.name);

    constructor(
        private readonly staffsClient: StaffsClientService,
        private readonly authClient: AuthClientService,
    ) { }

    async register(dto: RegisterStaffDto, authToken: string): Promise<RegisterStaffResponseDto> {
        this.logger.log(`Registering new staff: ${dto.email}`);

        const createStaffRequest: CreateStaffRequest = {
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            department: dto.department,
            position: dto.position,
            hireDate: dto.hireDate,
            isActive: dto.isActive ?? true,
        };

        const staff = await this.staffsClient.createStaff(createStaffRequest, authToken);
        this.logger.log(`Staff created with ID: ${staff.id}`);

        try {
            const registerRequest: RegisterRequest = {
                staffId: staff.id,
                email: dto.email,
                password: dto.password,
                role: dto.role || 'STAFF',
            };

            const auth = await this.authClient.register(registerRequest, authToken);
            this.logger.log(`Auth created for staff: ${staff.id}`);

            return {
                staff: {
                    id: staff.id,
                    email: staff.email,
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                },
                auth: {
                    userId: auth.id,
                },
            };
        } catch (error) {
            this.logger.error(`Auth creation failed, rolling back staff: ${staff.id}`);
            this.logger.error(error);

            await this.staffsClient.deleteStaff(staff.id, authToken);

            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to create authentication for staff',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
