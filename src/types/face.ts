export interface FaceShapeDetail {
  shape: string;
  description: string;
  celebrities: string[];
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
