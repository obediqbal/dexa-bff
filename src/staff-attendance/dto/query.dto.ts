import { Type, Transform } from 'class-transformer';
import {
    IsOptional,
    IsInt,
    Min,
    Max,
    IsString,
    IsIn,
    IsArray,
    IsDateString,
    IsBoolean,
} from 'class-validator';
import { ALL_SORT_FIELDS } from '../constants';

export class StaffAttendanceQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @IsIn([...ALL_SORT_FIELDS])
    sortBy?: string = 'clockIn';

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';

    // Common filter
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        return value.split(',').map((s: string) => s.trim());
    })
    staffIds?: string[];

    // Staff filters
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    // Attendance date filters
    @IsOptional()
    @IsDateString()
    clockInStart?: string;

    @IsOptional()
    @IsDateString()
    clockInEnd?: string;

    @IsOptional()
    @IsDateString()
    clockOutStart?: string;

    @IsOptional()
    @IsDateString()
    clockOutEnd?: string;
}
