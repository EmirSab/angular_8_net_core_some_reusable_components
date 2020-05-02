import { Photo } from './photo';

export interface User {
    // 9.3 Dodati interface User i properije -> photo.ts
    id: number;
    userName: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
    // 20.18.6 Dodati property za role ->user.managment.ts
    roles?: string[];
}
