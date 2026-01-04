import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export enum Role {
    STAFF = 'STAFF',
    ADMIN = 'ADMIN',
}

export class RegisterStaffDto {
    // Auth fields
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsOptional()
    @IsEnum(Role, { message: 'Role must be either STAFF or ADMIN' })
    role?: Role = Role.STAFF;

    // Staff fields
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsDateString()
    hireDate?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class RegisterStaffResponseDto {
    staff: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    auth: {
        userId: string;
        accessToken: string;
    };
}
