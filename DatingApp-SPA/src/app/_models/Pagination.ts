export interface Pagination {
    // 14.6 Dodati interface na font end i njegove propertije ->user.service
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}
