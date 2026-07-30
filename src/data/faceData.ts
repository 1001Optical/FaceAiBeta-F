import { FaceShapeDetail } from '@/types/face';

export const faceShapeDetails: FaceShapeDetail[] = [
  {
    shape: 'Diamond',
    image: `/result/Diamond.png`,
    description:
      'A narrow forehead and chin define this shape. Softer frames help balance the sharp angles and highlight cheekbones softly.',
    celebrities: [
      { name: 'Jennifer Lopez', gender: 'female' },
      { name: 'Benedict Cumberbatch', gender: 'male' },
      { name: 'Megan Fox', gender: 'female' },
      { name: 'Taye Diggs', gender: 'male' },
      { name: 'Taeyeon', gender: 'female' },
      { name: 'G-DRAGON', gender: 'male' },
    ],
  },
  {
    shape: 'Heart',
    image: `/result/Heart.png`,
    description:
      'A broad forehead and narrow jawline shape the face. Balanced frames soften the upper width and bring harmony to the full look.',
    celebrities: [
      { name: 'Ariana Grande', gender: 'female' },
      { name: 'Leonardo DiCaprio', gender: 'male' },
      { name: 'Scarlett Johansson', gender: 'female' },
      { name: 'NCT Jeno', gender: 'male' },
      { name: 'Natalie Portman', gender: 'female' },
      { name: 'Joseph Gordon-Levitt', gender: 'male' },
    ],
  },
  {
    shape: 'Oval',
    image: `/result/Oval.png`,
    description:
      'The width of the forehead and jawline are similar, with the widest part at the cheeks. Will look good in almost any frame style.',
    celebrities: [
      { name: 'Cha Eunwoo', gender: 'male' },
      { name: 'Millie Bobby Brown', gender: 'female' },
      { name: 'Jake Gyllenhaal', gender: 'male' },
      { name: 'Mary J. Blige', gender: 'female' },
      { name: 'Brad Pitt', gender: 'male' },
      { name: 'Fan Bingbing', gender: 'female' },
    ],
  },
  {
    shape: 'Round',
    image: `/result/Round.png`,
    description:
      'This face is round with full cheeks and a broad forehead. Structured frames define and balance the natural curves beautifully.',
    celebrities: [
      { name: 'Ed Sheeran', gender: 'male' },
      { name: 'Jill Scott', gender: 'female' },
      { name: 'BTS Jin', gender: 'male' },
      { name: 'Selena Gomez', gender: 'female' },
      { name: 'Jack Black', gender: 'male' },
      { name: 'Chrissy Teigen', gender: 'female' },
    ],
  },
  {
    shape: 'Square',
    image: `/result/Square.png`,
    description:
      'With equal width and length, plus a broad forehead and jawline, curved frames reduce harsh lines and create good balance.',
    celebrities: [
      { name: 'David Beckham', gender: 'male' },
      { name: 'Han Sohee', gender: 'female' },
      { name: 'EXO Chanyeol', gender: 'male' },
      { name: 'BLACKPINK Jennie', gender: 'female' },
      { name: 'Tom Cruise', gender: 'male' },
      { name: 'Naomi Campbell', gender: 'female' },
    ],
  },
];
