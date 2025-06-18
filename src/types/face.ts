export interface FaceShapeDetail {
  shape: string;
  image: string;
  description: string;
  celebrities: string[];
}

export interface FrameRecommendation {
  recommendedFrames: string[];
  reason: string;
}

export interface FrameShapeDetail {
  shape: string;
  image: string;
}

export interface FrameRecommendations {
  [key: string]: FrameRecommendation;
} 