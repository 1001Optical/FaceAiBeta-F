import { IFrameShapeDetail } from '@/types/face';

export const FaceShapeData: IFrameShapeDetail = {
  Oval: {
    image: "/result/avatar/oval.png",
    description: "Longer than wide, softly rounded",
    celebrities: {
      man: [],
      woman: [{
        name: "Lisa",
        img_src: "/celebs/Lisa.png"
      },
        {
          name: "Emma Watson",
          img_src: "/celebs/EmmaWatson.png"
        },
        {
          name: "Emma Watson1",
          img_src: "/celebs/EmmaWatson.png"
        }]
    },
    frameRecommendation: ["Square", "Round"]
  },
  Heart: {
    image: "/result/avatar/heart.png",
    description: "Wide forehead, gracefully tapered chin",
    celebrities: {
      man: [],
      woman: []
    },
    frameRecommendation: ["Rectangle", "Square"]
  },
  Round: {
    image: "/result/avatar/round.png",
    description: "Similar width and height, gently curved",
    celebrities: {
      man: [],
      woman: []
    },
    frameRecommendation: ["Round", "Pilot"]
  },
  Angular: {
    image: "/result/avatar/angular.png",
    description: "Jawline defined, sculptured facial lines",
    celebrities: {
      man: [],
      woman: []
    },
    frameRecommendation: ["Round", "Oval"]
  },
  Diamond: {
    image: "/result/avatar/diamond.png",
    description: "Narrow forehead and chin, elegantly wide cheekbones",
    celebrities: {
      man: [],
      woman: []
    },
    frameRecommendation: ["Round", "Square"]
  }
}