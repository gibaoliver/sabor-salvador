import { Restaurant, Event, RecentActivity } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'casa-de-tereza',
    name: 'Casa de Tereza',
    rating: 4.8,
    reviewsCount: 1450,
    neighborhood: 'Rio Vermelho',
    priceRange: '$$$',
    category: 'Moqueca',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'A Casa de Tereza é uma viagem de sabores em um ambiente que respira arte baiana. Cada prato conta uma história.',
    address: 'R. Odilon Santos, 45 - Rio Vermelho, Salvador - BA',
    phone: '+55 71 3329-3016',
    closesAt: '23:00',
    featured: true,
    dishes: [
      {
        id: 'moqueca-camarao',
        name: 'Moqueca de Camarão',
        description: 'Moqueca tradicional baiana cozida em panela de barro com camarões frescos, azeite de dendê, leite de coco e ervas frescas. Acompanha arroz, farofa e pirão.',
        price: 180.00
      },
      {
        id: 'bolinho-peixe',
        name: 'Bolinho de Peixe',
        description: 'Bolinhos crocantes de peixe temperado, servidos com molho de pimenta artesanal perfumada do sertão.',
        price: 45.00
      },
      {
        id: 'bobo-camarao',
        name: 'Bobó de Camarão',
        description: 'Camarões salteados no azeite de dendê, misturados em creme de aipim sedoso com leite de coco e coentro.',
        price: 175.00
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Maria Silva',
        rating: 5,
        comment: 'Absolutamente incrível a Moqueca! O ambiente é profundamente cultural e o atendimento nos faz sentir em casa na Bahia.',
        timeAgo: 'Há 2 horas'
      },
      {
        id: 'rev-2',
        author: 'Ana Santos',
        rating: 5,
        comment: 'O melhor vatapá que já comi no Rio Vermelho! O ambiente é incrível, cheio de quadros de artistas locais e música ambiente agradável.',
        timeAgo: 'Há 1 dia'
      }
    ]
  },
  {
    id: 'dona-mariquita',
    name: 'Dona Mariquita',
    rating: 4.9,
    reviewsCount: 920,
    neighborhood: 'Rio Vermelho',
    priceRange: '$$',
    category: 'Moqueca',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    description: 'Resgatando as origens da culinária baiana de raiz, a Dona Mariquita traz os sabores tradicionais dos terreiros e do recôncavo baiano.',
    address: 'R. do Meio, 178 - Rio Vermelho, Salvador - BA',
    phone: '+55 71 3334-1477',
    closesAt: '22:00',
    featured: true,
    dishes: [
      {
        id: 'acaraje-prato',
        name: 'Acarajé no Prato',
        description: 'Bolinho de feijão fradinho frito no dendê quente, servido com vatapá, caruru, salada e camarão seco descascado.',
        price: 32.00
      },
      {
        id: 'xinxim-galinha',
        name: 'Xinxim de Galinha',
        description: 'Galinha caipira ensopada com camarões e castanhas moídas, coentro picado e um toque rústico de dendê.',
        price: 88.00
      }
    ],
    reviews: [
      {
        id: 'mariq-rev-1',
        author: 'Carlos Santos',
        rating: 5,
        comment: 'Uma verdadeira imersão na cultura gastronômica original de Salvador. Recomendo muito o efó e o caruru!',
        timeAgo: 'Há 5 horas'
      }
    ]
  },
  {
    id: 'cuco-bistro',
    name: 'Cuco Bistrô',
    rating: 4.6,
    reviewsCount: 810,
    neighborhood: 'Pelourinho',
    priceRange: '$$$',
    category: 'Sushi',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    description: 'Localizado no coração do Pelourinho, combina a rica herança baiana com técnicas modernas de bistrô internacional.',
    address: 'Largo do Cruzeiro de São Francisco, 6/8 - Pelourinho, Salvador - BA',
    phone: '+55 71 3321-4322',
    closesAt: '23:30',
    featured: true,
    dishes: [
      {
        id: 'peixe-grelhado',
        name: 'Grelhado do Atlântico',
        description: 'Posta de peixe do dia grelhada com purê cremoso de banana d\'água terra e redução cítrica de maracujá da caatinga.',
        price: 92.00
      }
    ],
    reviews: [
      {
        id: 'cuco-rev-1',
        author: 'João P.',
        rating: 4,
        comment: 'Excelente localização e comida de alta qualidade. Sentar do lado de fora com vista para a igreja de São Francisco é mágico.',
        timeAgo: 'Há 4 horas'
      }
    ]
  },
  {
    id: 'a-casa-da-moqueca',
    name: 'A Casa da Moqueca',
    rating: 4.7,
    reviewsCount: 128,
    neighborhood: 'Rio Vermelho',
    priceRange: '$$',
    category: 'Moqueca',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Tradicional moqueca baiana servida em panela de barro com vista direta para o mar cristalino de Salvador.',
    address: 'Av. Oceanica, 230 - Rio Vermelho, Salvador - BA',
    phone: '+55 71 3244-9099',
    closesAt: '23:00',
    featured: false,
    dishes: [
      {
        id: 'moq-mista',
        name: 'Moqueca Mista (Peixe e Camarão)',
        description: 'O clássico absoluto. Servido fervendo com dendê legítimo e guarnição completa baiana.',
        price: 165.00
      }
    ],
    reviews: []
  },
  {
    id: 'farol-sabores',
    name: 'Farol Sabores',
    rating: 4.5,
    reviewsCount: 342,
    neighborhood: 'Barra',
    priceRange: '$$$',
    category: 'Hamburgueria',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    description: 'Culinária contemporânea com ingredientes locais frescos, localizada a poucos passos do Farol da Barra.',
    address: 'Av. Sete de Setembro, 4010 - Barra, Salvador - BA',
    phone: '+55 71 3331-5020',
    closesAt: '23:00',
    featured: false,
    dishes: [
      {
        id: 'burgue-bahia',
        name: 'Hambúrguer Sertanejo',
        description: 'Carne de sol artesanal Angus, queijo coalho grelhado, mel de engenho e cebola roxa caramelizada no dendê leve.',
        price: 48.00
      }
    ],
    reviews: []
  },
  {
    id: 'acaraje-da-dinha',
    name: 'Acarajé da Dinha',
    rating: 4.9,
    reviewsCount: 89,
    neighborhood: 'Pelourinho',
    priceRange: '$',
    category: 'Acarajé',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: 'O acarajé mais famoso do Pelourinho, crocante por fora e macio por dentro, transbordando afeto e recheio baiano fresco.',
    address: 'Largo de Santana - Rio Vermelho/Pelourinho, Salvador - BA',
    phone: '+55 71 99912-4022',
    closesAt: '00:00',
    featured: false,
    dishes: [
      {
        id: 'acaraje-completo',
        name: 'Acarajé Tradicional Completo',
        description: 'Acarajé quentinho recheado na hora com vatapá cremoso, caruru temperado, salada de tomate verde e camarão seco defumado.',
        price: 18.00
      }
    ],
    reviews: []
  },
  {
    id: 'sushibahia',
    name: 'Bahia Way Sushi',
    rating: 4.4,
    reviewsCount: 194,
    neighborhood: 'Pituba',
    priceRange: '$$',
    category: 'Sushi',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    description: 'Fusão incrível entre a culinária tradicional japonesa de alta precisão e temperos tropicais locais do nordeste.',
    address: 'Av. Manoel Dias da Silva, 120 - Pituba, Salvador - BA',
    phone: '+55 71 3240-5555',
    closesAt: '22:30',
    featured: false,
    dishes: [],
    reviews: []
  },
  {
    id: 'carmo-cafe',
    name: 'Café do Carmo Santo',
    rating: 4.8,
    reviewsCount: 156,
    neighborhood: 'Pelourinho',
    priceRange: '$',
    category: 'Café',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Cafés especiais cultivados na Chapada Diamantina servidos em casarão preservado do século XVIII de Santo Antônio além do Carmo.',
    address: 'R. Direita do Santo Antônio, 99 - Pelourinho, Salvador - BA',
    phone: '+55 71 3241-1122',
    closesAt: '20:00',
    featured: false,
    dishes: [],
    reviews: []
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'ev-1',
    title: 'Festival de Verão no Pelô: Celebrando as Raízes',
    date: 'Sábado, 20:00',
    time: '20:00 - 02:00',
    location: 'Largo do Pelourinho',
    neighborhood: 'Pelourinho',
    price: 'Garantir Ingresso',
    category: 'Axé',
    imageUrl: 'https://images.unsplash.com/photo-1580983231166-5e5d36e2d93e?auto=format&fit=crop&w=800&q=80',
    badge: 'DESTAQUE DA SEMANA',
    status: 'Confirmado'
  },
  {
    id: 'ev-2',
    title: 'Ensaio do Olodum',
    date: 'Domingo, 19:00',
    time: '19:00 - 23:00',
    location: 'Largo da Tieta - Pelourinho',
    neighborhood: 'Pelourinho',
    price: 'R$ 50,00',
    category: 'Samba',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    badge: 'Axé/Percussão',
    status: 'Confirmado'
  },
  {
    id: 'ev-3',
    title: 'BaianaSystem no Pelô',
    date: 'Sábado, 18:00',
    time: '18:00 - 22:00',
    location: 'Largo do Pelourinho',
    neighborhood: 'Pelourinho',
    price: 'Grátis',
    category: 'Alternativo',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    badge: 'Alternativo',
    status: 'Confirmado'
  },
  {
    id: 'ev-4',
    title: 'Jam no MAM',
    date: 'Sábado, 18:00',
    time: '18:00 - 22:00',
    location: 'Solar do Unhão - Contorno',
    neighborhood: 'Comércio',
    price: 'R$ 20,00',
    category: 'Jazz',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    badge: 'Jazz',
    status: 'Confirmado'
  },
  {
    id: 'ev-5',
    title: 'Forró no Rio Vermelho',
    date: 'Sábado, 17:00 / Sexta',
    time: '21:00 - 02:00',
    location: 'Vila Caramuru',
    neighborhood: 'Rio Vermelho',
    price: 'Esgotado',
    category: 'Forró',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    badge: 'Forró',
    status: 'Esgotado'
  }
];



export const INITIAL_DASHBOARD_METRICS: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'review',
    title: 'Nova avaliação de Maria S.',
    description: '"O melhor vatapá que já comi no Rio Vermelho! O ambiente é incrível e aconchegante demais."',
    rating: 5,
    timeAgo: 'Há 2 horas'
  },
  {
    id: 'act-2',
    type: 'reservation',
    title: 'Nova reserva confirmada',
    description: 'Mesa para 4 pessoas - Hoje às 20:00 (João P.)',
    timeAgo: 'Há 4 horas'
  },
  {
    id: 'act-3',
    type: 'menu',
    title: 'Cardápio atualizado',
    description: 'Você adicionou o prato "Moqueca Vegana de Caju" ao cardápio principal com sucesso.',
    timeAgo: 'Ontem'
  }
];
