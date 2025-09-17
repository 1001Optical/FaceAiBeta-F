import { IFrameShapeDetail } from '@/types/face';

export const FaceShapeData: IFrameShapeDetail = {
  Oval: {
    image: "/result/avatar/oval.png",
    description: "Longer than wide, softly rounded",
    celebrities: {
      man: [{
        name: "V",
        img_src: "/celebs/V.png"
      },
        {
          name: "Chris Evans",
          img_src: "/celebs/ChrisEvans.png"
        },
        {
          name: "John Legend",
          img_src: "/celebs/JohnLegend.png"
        }],
      woman: [{
        name: "Lisa",
        img_src: "/celebs/Lisa.png"
      },
        {
          name: "Emma Watson",
          img_src: "/celebs/EmmaWatson.png"
        },
        {
          name: "Tyra Banks",
          img_src: "/celebs/TyraBanks.png"
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
        img_src: "/celebs/SimuLiu.png"
      },
        {
          name: "Chris Hemsworth",
          img_src: "/celebs/ChrisHemsworth.png"
        },
        {
          name: "Bruno Mars",
          img_src: "/celebs/BrunoMars.png"
        }],
      woman: [{
        name: "Dilraba Dilmurat",
        img_src: "/celebs/DilrabaDilmurat.png"
      },
        {
          name: "Scarlett Johansson",
          img_src: "/celebs/ScarlettJohansson.png"
        },
        {
          name: "Keke Palmer",
          img_src: "/celebs/KekePalmer.png"
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
        img_src: "/celebs/RonnyChieng.png"
      },
        {
          name: "Leonardo Di Caprio",
          img_src: "/celebs/LeonardoDiCaprio.png"
        },
        {
          name: "Usher",
          img_src: "/celebs/Usher.png"
        }],
      woman: [{
        name: "Jihyo",
        img_src: "/celebs/Jihyo.png"
      },
        {
          name: "Selena Gomez",
          img_src: "/celebs/SelenaGomez.png"
        },
        {
          name: "Chrissy Teigen",
          img_src: "/celebs/ChrissyTeigen.png"
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
        img_src: "/celebs/ByungHunLee.png"
      },
        {
          name: "Tom Hardy",
          img_src: "/celebs/TomHardy.png"
        },
        {
          name: "Jordan Calloway",
          img_src: "/celebs/JordanCalloway.png"
        }],
      woman: [{
        name: "Jennie",
        img_src: "/celebs/Jennie.png"
      },
        {
          name: "Angelina Jolie",
          img_src: "/celebs/AngelinaJolie.png"
        },
        {
          name: "Ciara",
          img_src: "/celebs/Ciara.png"
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
        img_src: "/celebs/DylanWang.png"
      },
        {
          name: "Sean O'Pry",
          img_src: "/celebs/SeanO'Pry.png"
        },
        {
          name: "Ncuti Gatwa",
          img_src: "/celebs/NcutiGatwa.png"
        }],
      woman: [{
        name: "Karina",
        img_src: "/celebs/Karina.png"
      },
        {
          name: "Cate Blanchett",
          img_src: "/celebs/CateBlanchett.png"
        },
        {
          name: "Vanessa Hudgens",
          img_src: "/celebs/VanessaHudgens.png"
        }]
    },
    frameRecommendation: ["Round", "Square"]
  }
}