import { FrameShapeDetail } from '@/types/face';

export const frameShapeDetails: FrameShapeDetail[] = [
  {
    shape: 'Cat Eye',
    image: 'Cat Eye.png',
  },
  {
    shape: 'Pilot',
    image: 'Pilot.png',
  },
  {
    shape: 'Rectangle',
    image: 'Rectangle.png',
  },
  {
    shape: 'Round',
    image: 'Round.png',
  },
  {
    shape: 'Square',
    image: 'Square.png',
  },
  {
    shape: 'Oval',
    image: 'Oval.png',
  },
];

interface FrameProductType {
  [frame: string]: {
    name: string;
    vendor: string
    src: string;
  }[]
}

export const FrameProducts: FrameProductType = {
  Square: [{
    name: "LITEN 3 LT32",
    vendor: "1001 Premium",
    src: "/frame/LITEN_3_LT32",
  }],
  Round: [{
    name: "LITEN 3 LT32",
    vendor: "1001 Premium",
    src: "/frame/LITEN_3_LT32",
  }],
  Heart: [{
    name: "LITEN 3 LT32",
    vendor: "1001 Premium",
    src: "/frame/LITEN_3_LT32",
  }],
  Oval: [{
    name: "LITEN 3 LT32",
    vendor: "1001 Premium",
    src: "/frame/LITEN_3_LT32",
  }],
  Pilot: [{
    name: "LITEN 3 LT32",
    vendor: "1001 Premium",
    src: "/frame/LITEN_3_LT32",
  }]
}
