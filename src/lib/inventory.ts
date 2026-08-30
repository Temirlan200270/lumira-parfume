import type { CatalogSection, Gender } from './types'

export const PRODUCT_IMAGES_PUBLIC_BASE =
  'https://ilfmtebqvdyjwtxvsqzw.supabase.co/storage/v1/object/public/product-images'

export function productImageUrl(fileName: string): string {
  return `${PRODUCT_IMAGES_PUBLIC_BASE}/${fileName}`
}

export interface InventoryItem {
  brand: string
  name: string
  gender: Gender
  hit?: boolean
  section?: CatalogSection
  pricePerMl?: number
  tags?: string[]
  image?: string
}

export const inventory: InventoryItem[] = [
  { brand: 'Chanel', name: 'Chance Eau Vive', gender: 'female' },
  { brand: 'Chanel', name: 'Chance Eau Tendre', gender: 'female' },
  { brand: 'Yves Saint Laurent', name: 'Black Opium', gender: 'female', hit: true },
  { brand: 'Versace', name: 'Bright Crystal', gender: 'female' },
  { brand: "Victoria's Secret", name: 'Bombshells in Bloom', gender: 'female' },
  { brand: 'Lanvin', name: "Eclat d'Arpège", gender: 'female' },
  { brand: 'Gucci', name: 'Flora Gorgeous Gardenia', gender: 'female' },
  { brand: 'By Kilian', name: 'Good Girl Gone Bad Eau Fraîche', gender: 'female' },
  { brand: "Victoria's Secret", name: 'Scandalous', gender: 'female' },
  { brand: 'Yves Saint Laurent', name: 'Libre Le Parfum', gender: 'female' },
  { brand: 'Lattafa Perfumes', name: 'Yara', gender: 'female' },
  { brand: 'Creed', name: 'Aventus for Her', gender: 'female' },
  { brand: 'Haute Fragrance Company HFC', name: "Devil's Intrigue", gender: 'female' },
  { brand: 'Haute Fragrance Company HFC', name: 'Wear Love Everywhere', gender: 'female' },
  { brand: 'Giorgio Armani', name: 'My Way', gender: 'female' },
  { brand: 'Chanel', name: 'Coco Mademoiselle', gender: 'female' },
  { brand: 'Cacharel', name: 'Amor Amor', gender: 'female' },
  { brand: 'Montale', name: 'Roses Musk', gender: 'female' },
  { brand: 'Moschino', name: 'Toy 2 Bubble Gum', gender: 'female' },
  { brand: "Victoria's Secret", name: 'Eau So Sexy', gender: 'female' },
  { brand: 'Louis Vuitton', name: 'Attrape-Rêves', gender: 'female' },

  { brand: 'Creed', name: 'Aventus', gender: 'male', hit: true },
  { brand: 'Creed', name: 'Absolu Aventus', gender: 'male' },
  { brand: 'Creed', name: 'Silver Mountain Water', gender: 'male' },
  { brand: 'Jean Paul Gaultier', name: 'Le Male Elixir', gender: 'male' },
  { brand: 'Jean Paul Gaultier', name: 'Le Male Le Parfum', gender: 'male' },
  { brand: 'Jean Paul Gaultier', name: 'Le Beau Le Parfum', gender: 'male' },
  { brand: 'Chanel', name: 'Bleu de Chanel', gender: 'male' },
  { brand: 'Chopard', name: 'Oud Malaki', gender: 'male' },
  { brand: 'Versace', name: 'Versace Man Eau Fraiche', gender: 'male' },
  { brand: 'Dior', name: 'Dior Homme Intense 2011', gender: 'male' },
  { brand: 'Amouage', name: 'Epic Man', gender: 'male' },
  { brand: 'Lacoste Fragrances', name: 'Eau de Lacoste L.12.12. White', gender: 'male' },
  { brand: 'Givenchy', name: 'Gentleman Society', gender: 'male' },
  { brand: 'Louis Vuitton', name: "L'Immensité", gender: 'male' },
  { brand: 'Louis Vuitton', name: 'Imagination', gender: 'male' },
  { brand: 'Louis Vuitton', name: 'Météore', gender: 'male' },
  { brand: 'Bvlgari', name: 'Tygar', gender: 'male' },
  { brand: 'Yves Saint Laurent', name: 'Y Eau de Parfum', gender: 'male' },
  { brand: 'Roja Dove', name: 'Elysium Pour Homme Parfum Cologne', gender: 'male' },
  { brand: 'Roja Dove', name: 'Apex', gender: 'male' },
  { brand: 'Roja Dove', name: 'Oligarch', gender: 'male' },
  { brand: 'Antonio Banderas', name: 'Blue Seduction', gender: 'male' },
  { brand: 'Valentino', name: 'Valentino Uomo Born In Roma Intense', gender: 'male' },
  { brand: 'Giorgio Armani', name: 'Acqua di Giò Profondo', gender: 'male' },
  { brand: 'Giorgio Armani', name: 'Acqua di Gio', gender: 'male' },
  { brand: 'Giorgio Armani', name: 'Emporio Armani Stronger With You Intensely', gender: 'male' },
  { brand: 'Giorgio Armani', name: 'Emporio Armani Stronger With You Absolutely', gender: 'male' },
  { brand: 'Parfums de Marly', name: 'Althaïr', gender: 'male' },
  { brand: 'Viktor&Rolf', name: 'Spicebomb', gender: 'male' },
  { brand: 'Dior', name: 'Sauvage Elixir', gender: 'male' },

  { brand: 'Ex Nihilo', name: 'Fleur Narcotique', gender: 'unisex' },
  { brand: 'Escentric Molecules', name: 'Escentric 02', gender: 'unisex' },
  { brand: 'Boadicea the Victorious', name: 'Hanuman', gender: 'unisex' },
  { brand: 'Hormone Paris', name: 'Gaba', gender: 'unisex' },
  { brand: 'Clive Christian', name: 'Blonde Amber', gender: 'unisex' },
  { brand: 'Clive Christian', name: 'Jump Up And Kiss Me Hedonistic (2021)', gender: 'unisex' },
  { brand: 'Clive Christian', name: 'Matsukita', gender: 'unisex' },
  { brand: 'Creed', name: 'Royal Mayfair 2024', gender: 'unisex' },
  { brand: 'Ex Nihilo', name: 'Blue Talisman', gender: 'unisex' },
  { brand: 'Amouage', name: 'Purpose 50', gender: 'unisex' },
  { brand: 'Initio Parfums Prives', name: 'Absolute Aphrodisiac', gender: 'unisex' },
  { brand: 'Initio Parfums Prives', name: 'Oud for Greatness', gender: 'unisex' },
  { brand: 'By Kilian', name: 'Black Phantom', gender: 'unisex' },
  { brand: 'By Kilian', name: 'Rolling in Love', gender: 'unisex' },
  { brand: 'Louis Vuitton', name: 'Afternoon Swim', gender: 'unisex' },
  { brand: 'Louis Vuitton', name: 'Ombre Nomade', gender: 'unisex' },
  { brand: 'Louis Vuitton', name: 'Pacific Chill', gender: 'unisex' },
  { brand: 'Maison Francis Kurkdjian', name: 'Baccarat Rouge 540', gender: 'unisex', hit: true },
  { brand: 'Mancera', name: 'Red Tobacco', gender: 'unisex', image: productImageUrl('mancera-red-tobacco.jpg') },
  { brand: 'Montale', name: 'Arabians Tonka', gender: 'unisex' },
  { brand: 'Nasomatto', name: 'Black Afgano', gender: 'unisex' },
  { brand: 'Orto Parisi', name: 'Megamare', gender: 'unisex' },
  { brand: 'Parfums de Marly', name: 'Greenley', gender: 'unisex' },
  { brand: 'Parfums de Marly', name: 'Layton', gender: 'unisex' },
  { brand: 'Roja Dove', name: 'Isola Blu', gender: 'unisex' },
  { brand: 'Roja Dove', name: 'Burlington 1819', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Fucking Fabulous', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Tobacco Vanille', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Lost Cherry', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Ombré Leather Parfum', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Oud Wood', gender: 'unisex' },
  { brand: 'Tom Ford', name: 'Vanilla Sex', gender: 'unisex' },
  { brand: 'Maison Crivelli', name: 'Hibiscus Mahajád', gender: 'unisex' },
  { brand: 'Maison Crivelli', name: 'Oud Maracujá', gender: 'unisex' },
  { brand: 'Marc-Antoine Barrois', name: 'Aldebaran', gender: 'unisex' },
  { brand: 'Marc-Antoine Barrois', name: 'Tilia', gender: 'unisex' },
  { brand: 'Marc-Antoine Barrois', name: 'Ganymede', gender: 'unisex' },
  { brand: 'Zielinski & Rozen', name: 'Black Pepper & Amber, Neroli', gender: 'unisex' },
  { brand: 'Zielinski & Rozen', name: 'Vanilla Blend', gender: 'unisex' },
  { brand: 'Richard', name: 'White Chocola', gender: 'unisex' },

  {
    brand: 'Thomas Kosmala',
    name: 'No.12 Oud Douze',
    gender: 'unisex',
    section: 'raspiv',
    pricePerMl: 1600,
    tags: ['уд дуз', 'томас космала'],
    image: productImageUrl('thomas-kosmala-no-12-oud-douze.jpg'),
  },
  {
    brand: 'Mancera',
    name: 'Cedrat Boise',
    gender: 'unisex',
    section: 'raspiv',
    pricePerMl: 1500,
    tags: ['цедрат боис', 'манкера'],
    image: productImageUrl('mancera-cedrat-boise.jpg'),
  },
  {
    brand: 'Mancera',
    name: 'Red Tobacco',
    gender: 'unisex',
    section: 'raspiv',
    pricePerMl: 1500,
    tags: ['ред тобако', 'манкера'],
    image: productImageUrl('mancera-red-tobacco.jpg'),
  },
]
