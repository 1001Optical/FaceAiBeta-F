export interface ProductType  {
  name: string;
  vendor: string
  src: string;
}

export interface FrameProductType {
  [frame: string]: {
    name: string;
    vendor: string
    src: string;
  }[]
}

export type FrameCatalogShape = 'Square' | 'Round' | 'Rectangle' | 'Oval' | 'Pilot';

export const FrameProducts: FrameProductType = {
  Square: [
    {
      "name": "A0012",
      "vendor": "ALLEGRO",
      "src": "/frame/A0012"
    },{
      "name": "DN01",
      "vendor": "Signature",
      "src": "/frame/DN01"
    }
  ],
  Round: [
    {
      "name": "T2003",
      "vendor": "ALLEGRO",
      "src": "/frame/T2003"
    },{
      "name": "DN02",
      "vendor": "Signature",
      "src": "/frame/DN02"
    }
  ],
  Rectangle: [
    {
      "name": "T2002",
      "vendor": "ALLEGRO",
      "src": "/frame/T2002"
    },{
      "name": "OG3003",
      "vendor": "Signature",
      "src": "/frame/OG3003"
    }
  ],
  Oval: [
    {
      "name": "SF41",
      "vendor": "Signature",
      "src": "/frame/SF41"
    }
  ],
  Pilot: [
    {
      "name": "LT53",
      "vendor": "1001 Premium",
      "src": "/frame/LT53"
    }
  ]
}

export const FALLBACK_FRAME_PRODUCTS = FrameProducts;
