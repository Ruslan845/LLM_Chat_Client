export type SectionType = {
  id: string;
  title: string;
  content: string;
  user: {
    name: string;
    readTime?: string;
    avatar: string;
  };
  date: string;
  stats: {
    views: string;
    comments: string;
  };
  sources?: string;
};

export const cards = [
  {
    id: 1,
    title: `DeepMind's Hassabis Wins Nobel in Chemistry`,
    description:
      'According to the Royal Swedish Academy of Sciences, Demis Hassabis and John Jumper of Google DeepMind have been awarded the 2024 Nobel Prize in Chemistry for their groundbreaking work on protein structure prediction using artificial intelligence, sharing the honor with David Baker for his advances in computational protein design.',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg', // Replace with the actual image URL
  },
  {
    id: 2,
    title: 'The "Human Authored" Book Label',
    description: 'Exploring the impact of AI on human authorship...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728043256/getty_uploads/113492099.jpg',
  },
  {
    id: 3,
    title: 'Hopfield and Hinton Win Nobel for AI Work',
    description:
      'Pioneers of deep learning are honored with the prestigious Nobel Prize...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728043256/getty_uploads/113492099.jpg',
  },
  {
    id: 4,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/fetch/s--_y8I-5_T--/t_thumbnail/https://www.miamiherald.com/latest-news/13hc16/picture293604259/alternates/LANDSCAPE_1140/2000x2000.jpg',
  },
  {
    id: 5,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg',
  },
  {
    id: 5,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg',
  },
  {
    id: 5,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg',
  },
  {
    id: 5,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg',
  },
  {
    id: 5,
    title: 'Taiwan Faces an Energy Crunch',
    description:
      'Amid geopolitical tensions, Taiwan is battling energy shortages...',
    imageUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1728500711/getty_uploads/2177656386.jpg',
  },
];

export const sections: SectionType[] = [
  {
    id: '1',
    title: 'Nobel Prize in Chemistry 2024',
    content:
      'According to the Royal Swedish Academy of Sciences, Demis Hassabis and John Jumper of Google DeepMind have been awarded the 2024 Nobel Prize in Chemistry for their groundbreaking work on protein structure prediction using artificial intelligence, sharing the honor with David Baker for his advances in computational protein design.',
    user: {
      name: 'Lorem ipsum dolor sit.',
      readTime: '1 min read',
      avatar:
        'https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail',
    },
    date: '1 day ago',
    stats: {
      views: '3,454',
      comments: '3,234',
    },
  },
  {
    id: '2',
    title: 'Nobel Prize Recipients',
    content:
      'The 2024 Nobel Prize in Chemistry was awarded to three scientists for their groundbreaking work in protein research. Half of the prize, worth 11 million Swedish kronor ($1.06 million), was jointly awarded to Demis Hassabis and John Jumper of Google DeepMind for their work on protein structure prediction. The other half went to David Baker from the University of Washington for his advances in computational protein design.',
    sources: '5 sources',
    date: '1 day ago',
    stats: {
      views: '3,454',
      comments: '3,234',
    },
    user: {
      name: 'Source User',
      avatar:
        'https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail',
    },
  },
  {
    id: '3',
    date: '1 day ago',
    stats: {
      views: '3,454',
      comments: '3,234',
    },
    title: 'Nobel Prize Recipients',
    content:
      'The 2024 Nobel Prize in Chemistry was awarded to three scientists for their groundbreaking work in protein research. Half of the prize, worth 11 million Swedish kronor ($1.06 million), was jointly awarded to Demis Hassabis and John Jumper of Google DeepMind for their work on protein structure prediction. The other half went to David Baker from the University of Washington for his advances in computational protein design.',
    sources: '5 sources',
    user: {
      name: 'Source User',
      avatar:
        'https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail',
    },
  },
  {
    id: '4',
    date: '1 day ago',
    stats: {
      views: '3,454',
      comments: '3,234',
    },
    title: 'Nobel Prize Recipients',
    content:
      'The 2024 Nobel Prize in Chemistry was awarded to three scientists for their groundbreaking work in protein research. Half of the prize, worth 11 million Swedish kronor ($1.06 million), was jointly awarded to Demis Hassabis and John Jumper of Google DeepMind for their work on protein structure prediction. The other half went to David Baker from the University of Washington for his advances in computational protein design.',
    sources: '5 sources',
    user: {
      name: 'Source User',
      avatar:
        'https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail',
    },
  },
  {
    id: '5',
    date: '1 day ago',
    stats: {
      views: '3,454',
      comments: '3,234',
    },
    title: 'Nobel Prize Recipients',
    content:
      'The 2024 Nobel Prize in Chemistry was awarded to three scientists for their groundbreaking work in protein research. Half of the prize, worth 11 million Swedish kronor ($1.06 million), was jointly awarded to Demis Hassabis and John Jumper of Google DeepMind for their work on protein structure prediction. The other half went to David Baker from the University of Washington for his advances in computational protein design.',
    sources: '5 sources',
    user: {
      name: 'Source User',
      avatar:
        'https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail',
    },
  },
];
