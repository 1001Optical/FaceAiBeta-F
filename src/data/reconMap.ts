import { FrameRecommendations } from '@/types/face';

export const frameRecommendations: FrameRecommendations = {
  'Round': {
    // recommendedFrames: ['Rectangle', 'Cat Eye'],
    recommendedFrames: ['Rectangle', 'Pilot'],
  },
  'Oval': {
    // recommendedFrames: ['Pilot', 'Cat Eye'],
    recommendedFrames: ['Pilot', 'Rectangle'],
  },
  'Square': {
    recommendedFrames: ['Round', 'Oval'],
  },
  'Heart': {
    // recommendedFrames: ['Cat Eye', 'Oval'],
    recommendedFrames: ['Oval', 'Rectangle'],
  },
  'Diamond': { 
    // recommendedFrames: ['Cat Eye', 'Oval'],
    recommendedFrames: ['Oval', 'Square'],
  },
};