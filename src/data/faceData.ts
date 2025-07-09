import { FaceShapeDetail } from '@/types/face';

export const faceShapeDetails: FaceShapeDetail[] = [
  {
    shape: 'Diamond',
    image: 'FaceType_Diamond.png',
    description:
      'A narrow forehead and chin define this shape. Softer frames help balance the sharp angles and highlight cheekbones softly.',
        celebrities: ['Benedict Cumberbatch', 'Megan Fox', 'Taye Diggs', 'Taeyeon', 'Cillian Murphy', 'G-DRAGON'],
  },
  {
    shape: 'Heart-Shaped Face',
    image: 'FaceType_Heart.png',
    description:
      "A broad forehead and narrow jawline shape the face. Balanced frames soften the upper width and bring harmony to the full look.",
      celebrities: ['Ariana Grande', 'NCT Jeno', 'Scarlett Johansson', 'Joseph Gordon-Levitt', 'Reese Witherspoon', 'Natalie Portman'],
  },
  {
    shape: 'Oval Face',
    image: 'FaceType_Oval.png',
    description:
      "The width of the forehead and jawline are similar, with the widest part at the cheeks. Will look good in almost any frame style.",
      celebrities: ['Millie Bobby Brown', 'Cha Eunwoo', 'Mary J. Blige', 'Jake Gyllenhaal', 'Fan Bingbing', 'IU'],
  },
  {
    shape: 'Round Face',
    image: 'FaceType_Round.png',
    description:
      'This face is round with full cheeks and a broad forehead. Structured frames define and balance the natural curves beautifully.',
      celebrities: ['Jill Scott', 'BTS Jin', 'Selena Gomez', 'Ed Sheeran', 'Chrissy Teigen', 'Matsumoto Jun'],
  },
  {
    shape: 'Square Face',
    image: 'FaceType_Square.png',
    description:
      "With equal width and length, plus a broad forehead and jawline, curved frames reduce harsh lines and create good balance.",
      celebrities: ['BLACKPINK Jennie', 'David Beckham', 'Angelina Jolie', 'EXO Chanyeol', 'Naomi Campbell', 'Han Sohee'],
  },
];
