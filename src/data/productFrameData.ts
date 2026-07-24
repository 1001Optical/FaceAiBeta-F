export type ResultFaceShape = 'Diamond' | 'Heart' | 'Oval' | 'Angular' | 'Round';
export type ProductFrameShape = 'Rectangle' | 'Square' | 'Round' | 'Oval' | 'Pilot';

export interface FrameProduct {
    name: string;
    vendor: string;
    src: string;
}

export const frameProducts: Record<ProductFrameShape, FrameProduct[]> = {
    Square: [
        { name: 'A0012', vendor: 'ALLEGRO', src: '/frame/A0012' },
        { name: 'DN01', vendor: 'Signature', src: '/frame/DN01' },
    ],
    Round: [
        { name: 'T2003', vendor: 'ALLEGRO', src: '/frame/T2003' },
        { name: 'DN02', vendor: 'Signature', src: '/frame/DN02' },
    ],
    Rectangle: [
        { name: 'T2002', vendor: 'ALLEGRO', src: '/frame/T2002' },
        { name: 'OG3003', vendor: 'Signature', src: '/frame/OG3003' },
    ],
    Oval: [
        { name: 'SF41', vendor: 'Signature', src: '/frame/SF41' },
    ],
    Pilot: [
        { name: 'LT53', vendor: '1001 Premium', src: '/frame/LT53' },
    ],
};

export const resultRecommendations: Record<ResultFaceShape, ProductFrameShape[]> = {
    Diamond: ['Round', 'Square'],
    Heart: ['Round', 'Pilot'],
    Oval: ['Square', 'Round'],
    Angular: ['Round', 'Oval'],
    Round: ['Rectangle', 'Square'],
};

export function isResultFaceShape(value: string): value is ResultFaceShape {
    return ['Diamond', 'Heart', 'Oval', 'Angular', 'Round'].includes(value);
}
