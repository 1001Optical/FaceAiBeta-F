import { IFrameShapeDetail } from '@/types/optimizedResultTypes';

export const FaceShapeData: IFrameShapeDetail = {
  Oval: {
    image: "/result/avatar/oval.png",
    description: "Longer than wide, softly rounded",
    celebrities: {
      man: [{
        name: "V",
        img_src: "/celebs/V.webp"
      },
        {
          name: "Chris Evans",
          img_src: "/celebs/ChrisEvans.webp"
        },
        {
          name: "John Legend",
          img_src: "/celebs/JohnLegend.webp"
        }],
      woman: [{
        name: "Lisa",
        img_src: "/celebs/Lisa.webp"
      },
        {
          name: "Emma Watson",
          img_src: "/celebs/EmmaWatson.webp"
        },
        {
          name: "Tyra Banks",
          img_src: "/celebs/TyraBanks.webp"
        }]
    },
    frameRecommendation: ["Square", "Round"]
  },
  Heart: {
    image: "/result/avatar/heart.png",
    description: "Wide forehead, gracefully tapered chin",
    celebrities: {
      man: [{
        name: "Simu Liu",
        img_src: "/celebs/SimuLiu.webp"
      },
        {
          name: "Chris Hemsworth",
          img_src: "/celebs/ChrisHemsworth.webp"
        },
        {
          name: "Bruno Mars",
          img_src: "/celebs/BrunoMars.webp"
        }],
      woman: [{
        name: "Dilraba Dilmurat",
        img_src: "/celebs/DilrabaDilmurat.webp"
      },
        {
          name: "Scarlett Johansson",
          img_src: "/celebs/ScarlettJohansson.webp"
        },
        {
          name: "Keke Palmer",
          img_src: "/celebs/KekePalmer.webp"
        }]
    },
    frameRecommendation: ["Round", "Pilot"]
  },
  Round: {
    image: "/result/avatar/round.png",
    description: "Similar width and height, gently curved",
    celebrities: {
      man: [{
        name: "Ronny Chieng",
        img_src: "/celebs/RonnyChieng.webp"
      },
        {
          name: "Leonardo Di Caprio",
          img_src: "/celebs/LeonardoDiCaprio.webp"
        },
        {
          name: "Usher",
          img_src: "/celebs/Usher.webp"
        }],
      woman: [{
        name: "Jihyo",
        img_src: "/celebs/Jihyo.webp"
      },
        {
          name: "Selena Gomez",
          img_src: "/celebs/SelenaGomez.webp"
        },
        {
          name: "Chrissy Teigen",
          img_src: "/celebs/ChrissyTeigen.webp"
        }]
    },
    frameRecommendation: ["Rectangle", "Square"]
  },
  Angular: {
    image: "/result/avatar/angular.png",
    description: "Jawline defined, sculptured facial lines",
    celebrities: {
      man: [{
        name: "Byung Hun Lee",
        img_src: "/celebs/ByungHunLee.webp"
      },
        {
          name: "Tom Hardy",
          img_src: "/celebs/TomHardy.webp"
        },
        {
          name: "Jordan Calloway",
          img_src: "/celebs/JordanCalloway.webp"
        }],
      woman: [{
        name: "Jennie",
        img_src: "/celebs/Jennie.webp"
      },
        {
          name: "Angelina Jolie",
          img_src: "/celebs/AngelinaJolie.webp"
        },
        {
          name: "Ciara",
          img_src: "/celebs/Ciara.webp"
        }]
    },
    frameRecommendation: ["Round", "Oval"]
  },
  Diamond: {
    image: "/result/avatar/diamond.png",
    description: "Narrow forehead and chin, elegantly wide cheekbones",
    celebrities: {
      man: [{
        name: "Dylan Wang",
        img_src: "/celebs/DylanWang.webp"
      },
        {
          name: "Sean O'Pry",
          img_src: "/celebs/SeanO'Pry.webp"
        },
        {
          name: "Ncuti Gatwa",
          img_src: "/celebs/NcutiGatwa.webp"
        }],
      woman: [{
        name: "Karina",
        img_src: "/celebs/Karina.webp"
      },
        {
          name: "Cate Blanchett",
          img_src: "/celebs/CateBlanchett.webp"
        },
        {
          name: "Vanessa Hudgens",
          img_src: "/celebs/VanessaHudgens.webp"
        }]
    },
    frameRecommendation: ["Round", "Square"]
  }
}
