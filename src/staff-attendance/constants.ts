// Staff sortable fields
export const STAFF_SORT_FIELDS = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'department',
    'position',
    'hireDate',
    'isActive',
    'createdAt',
] as const;

// Attendance sortable fields
export const ATTENDANCE_SORT_FIELDS = ['clockIn', 'clockOut'] as const;

// All sortable fields
export const ALL_SORT_FIELDS = [...STAFF_SORT_FIELDS, ...ATTENDANCE_SORT_FIELDS] as const;

// Staff filter fields
export const STAFF_FILTER_FIELDS = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'department',
    'position',
    'isActive',
] as const;

// Attendance filter fields (date ranges handled separately)
export const ATTENDANCE_DATE_FIELDS = [
    'clockInStart',
    'clockInEnd',
    'clockOutStart',
    'clockOutEnd',
] as const;

export type StaffSortField = (typeof STAFF_SORT_FIELDS)[number];
export type AttendanceSortField = (typeof ATTENDANCE_SORT_FIELDS)[number];
export type AllSortField = (typeof ALL_SORT_FIELDS)[number];
