export interface Photo {
    // 9.3.1 Dodati propertije ->user.service
    id: number;
    url: string;
    description: string;
    dateAdded: Date;
    isMain: boolean;
    // 20.23.4 Dodati property ->photo-editor.ts
    isApproved: boolean;
}
