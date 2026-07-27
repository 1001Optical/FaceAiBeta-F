export type TFaceShape = "Diamond" | "Heart" | "Oval" | "Angular" | "Round"
export type TFrameShape = "Rectangle" | "Square" | "Round" | "Oval" | "Pilot" | "Cat eye"

export interface Celebrity {
  name: string;
  gender: 'male' | 'female';
}

export interface FaceShapeDetail {
  shape: string;
  image: string;
  description: string;
  celebrities: Celebrity[];
}

export interface FrameRecommendation {
  recommendedFrames: string[];
}

export interface FrameShapeDetail {
  shape: string;
  image: string;
}

export interface FrameRecommendations {
  [key: string]: FrameRecommendation;
}

export interface CelebType {
  name: string;
  img_src: string;
}

export interface IFrameShapeDetail {
  [shape: string]: {
    image: string;
    description: string;
    celebrities: {
      man: CelebType[],
      woman: CelebType[]
    };
    frameRecommendation: TFrameShape[]
  }
}