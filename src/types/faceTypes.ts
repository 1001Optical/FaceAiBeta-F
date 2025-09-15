import { CelebType } from '@/types/face';

export type TFaceShape = "Diamond" | "Heart" | "Oval" | "Angular" | "Round"
export type TFrameShape = "Rectangle" | "Square" | "Round" | "Oval" | "Pilot" | "Cat eye"


export interface IFrameShapeDetail {
  [shape: string]: {
    image: string;
    description: string;
    celebrities: CelebType[];
    frameRecommendation: TFrameShape[]
  }
}