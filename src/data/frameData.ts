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

export const FrameProducts: FrameProductType = {
  Square: [{
    name: "DN01",
    vendor: "1001 Signature",
    src: "/frame/DN01",
  }],
  Round: [{
    name: "DN02",
    vendor: "1001 Signature",
    src: "/frame/DN02",
  }],
  Rectangle: [{
    name: "OG3003",
    vendor: "1001 Signature",
    src: "/frame/OG3003",
  }],
  Oval: [{
    name: "SF41",
    vendor: "Signature",
    src: "/frame/SF41",
  }],
  Pilot: [{
    name: "LT53",
    vendor: "1001 Premium",
    src: "/frame/LT53",
  }]
}
