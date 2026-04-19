/**
 * Database Seed Script
 * Creates admin user and sample products
 * Run: npm run seed
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Gold Serpent Ring',
    nameEn: 'Gold Serpent Ring',
    nameFr: 'Bague Serpent Dorée',
    nameEs: 'Anillo Serpiente Dorado',
    description: 'Elegant 18k gold serpent ring with intricate detailing.',
    descriptionEn: 'Elegant 18k gold serpent ring with intricate detailing. A timeless piece that wraps gracefully around your finger.',
    descriptionFr: 'Élégante bague serpent en or 18 carats avec des détails complexes. Une pièce intemporelle qui s\'enroule gracieusement autour de votre doigt.',
    descriptionEs: 'Elegante anillo serpiente de oro 18k con detalles intrincados. Una pieza atemporal que se envuelve graciosamente alrededor de tu dedo.',
    price: 189.99,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
    category: 'RINGS',
    gender: 'WOMEN',
    stock: 15,
    featured: true,
  },
  {
    name: 'Diamond Tennis Bracelet',
    nameEn: 'Diamond Tennis Bracelet',
    nameFr: 'Bracelet Tennis Diamant',
    nameEs: 'Pulsera Tenis de Diamantes',
    description: 'Classic tennis bracelet with brilliant-cut crystals.',
    descriptionEn: 'Classic tennis bracelet with brilliant-cut crystals set in sterling silver. Perfect for any occasion.',
    descriptionFr: 'Bracelet tennis classique avec des cristaux taille brillant sertis en argent sterling. Parfait pour toutes les occasions.',
    descriptionEs: 'Clásica pulsera de tenis con cristales de corte brillante engastados en plata esterlina. Perfecta para cualquier ocasión.',
    price: 249.99,
    images: ['https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600'],
    category: 'BRACELETS',
    gender: 'WOMEN',
    stock: 8,
    featured: true,
  },
  {
    name: 'Obsidian Chain Necklace',
    nameEn: 'Obsidian Chain Necklace',
    nameFr: 'Collier Chaîne Obsidienne',
    nameEs: 'Collar Cadena Obsidiana',
    description: 'Bold black chain necklace for men.',
    descriptionEn: 'Bold matte black chain necklace crafted from stainless steel. Statement piece for the modern man.',
    descriptionFr: 'Audacieux collier chaîne noir mat fabriqué en acier inoxydable. Pièce maîtresse pour l\'homme moderne.',
    descriptionEs: 'Audaz collar de cadena negro mate fabricado en acero inoxidable. Pieza de declaración para el hombre moderno.',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'],
    category: 'NECKLACES',
    gender: 'MEN',
    stock: 20,
    featured: true,
  },
  {
    name: 'Minimalist Gold Hoops',
    nameEn: 'Minimalist Gold Hoops',
    nameFr: 'Créoles Dorées Minimalistes',
    nameEs: 'Aros Dorados Minimalistas',
    description: 'Simple and elegant gold hoop earrings.',
    descriptionEn: 'Simple and elegant 14k gold hoop earrings. Lightweight and comfortable for everyday wear.',
    descriptionFr: 'Boucles d\'oreilles créoles en or 14 carats, simples et élégantes. Légères et confortables pour un port quotidien.',
    descriptionEs: 'Pendientes de aro de oro de 14k simples y elegantes. Ligeros y cómodos para uso diario.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600'],
    category: 'EARRINGS',
    gender: 'WOMEN',
    stock: 30,
    featured: false,
  },
  {
    name: 'Leather Chronograph Watch',
    nameEn: 'Leather Chronograph Watch',
    nameFr: 'Montre Chronographe en Cuir',
    nameEs: 'Reloj Cronógrafo de Cuero',
    description: 'Classic leather strap chronograph watch for men.',
    descriptionEn: 'Classic chronograph watch with genuine leather strap and Japanese movement. Water resistant to 50m.',
    descriptionFr: 'Montre chronographe classique avec bracelet en cuir véritable et mouvement japonais. Résistante à l\'eau jusqu\'à 50m.',
    descriptionEs: 'Reloj cronógrafo clásico con correa de cuero genuino y movimiento japonés. Resistente al agua hasta 50m.',
    price: 299.99,
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600'],
    category: 'WATCHES',
    gender: 'MEN',
    stock: 12,
    featured: true,
  },
  {
    name: 'Pearl Drop Necklace',
    nameEn: 'Pearl Drop Necklace',
    nameFr: 'Collier Pendentif Perle',
    nameEs: 'Collar Colgante de Perla',
    description: 'Delicate freshwater pearl pendant necklace.',
    descriptionEn: 'Delicate freshwater pearl pendant on a fine gold chain. A classic piece that never goes out of style.',
    descriptionFr: 'Délicat pendentif en perle d\'eau douce sur une fine chaîne en or. Une pièce classique qui ne se démode jamais.',
    descriptionEs: 'Delicado colgante de perla de agua dulce en una fina cadena de oro. Una pieza clásica que nunca pasa de moda.',
    price: 159.99,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
    category: 'NECKLACES',
    gender: 'WOMEN',
    stock: 18,
    featured: false,
  },
  {
    name: 'Leather Bifold Wallet',
    nameEn: 'Leather Bifold Wallet',
    nameFr: 'Portefeuille Cuir Bifold',
    nameEs: 'Billetera Bifold de Cuero',
    description: 'Premium full-grain leather bifold wallet for men.',
    descriptionEn: 'Premium full-grain leather bifold wallet with 8 card slots and RFID protection. Slim profile.',
    descriptionFr: 'Portefeuille bifold en cuir pleine fleur avec 8 emplacements pour cartes et protection RFID. Profil mince.',
    descriptionEs: 'Billetera bifold de cuero de grano completo con 8 ranuras para tarjetas y protección RFID. Perfil delgado.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
    category: 'BAGS',
    gender: 'MEN',
    stock: 25,
    featured: false,
  },
  {
    name: 'Crystal Stud Earrings',
    nameEn: 'Crystal Stud Earrings',
    nameFr: 'Boucles Clou Cristal',
    nameEs: 'Aretes de Cristal',
    description: 'Sparkling crystal stud earrings in silver setting.',
    descriptionEn: 'Sparkling crystal stud earrings set in 925 sterling silver. Hypoallergenic posts.',
    descriptionFr: 'Boucles d\'oreilles clou en cristal scintillant serties en argent sterling 925. Tiges hypoallergéniques.',
    descriptionEs: 'Aretes de cristal brillante engastados en plata esterlina 925. Varillas hipoalergénicas.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'],
    category: 'EARRINGS',
    gender: 'WOMEN',
    stock: 40,
    featured: false,
  },
  {
    name: 'Signet Ring',
    nameEn: 'Signet Ring',
    nameFr: 'Chevalière',
    nameEs: 'Anillo de Sello',
    description: 'Bold gold signet ring for men.',
    descriptionEn: 'Bold 18k gold vermeil signet ring. A timeless symbol of elegance and authority.',
    descriptionFr: 'Bague chevalière audacieuse en vermeil d\'or 18 carats. Un symbole intemporel d\'élégance et d\'autorité.',
    descriptionEs: 'Anillo de sello llamativo en vermeil de oro de 18k. Un símbolo atemporal de elegancia y autoridad.',
    price: 219.99,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
    category: 'RINGS',
    gender: 'MEN',
    stock: 10,
    featured: true,
  },
  {
    name: 'Woven Leather Belt',
    nameEn: 'Woven Leather Belt',
    nameFr: 'Ceinture Cuir Tressée',
    nameEs: 'Cinturón de Cuero Tejido',
    description: 'Handcrafted woven leather belt with gold buckle.',
    descriptionEn: 'Handcrafted woven Italian leather belt with a polished gold-tone buckle. Adjustable sizing.',
    descriptionFr: 'Ceinture en cuir italien tressé fait main avec une boucle dorée polie. Taille ajustable.',
    descriptionEs: 'Cinturón de cuero italiano tejido a mano con una hebilla en tono dorado pulido. Talla ajustable.',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    category: 'BELTS',
    gender: 'UNISEX',
    stock: 22,
    featured: false,
  },
  {
    name: 'Aviator Sunglasses',
    nameEn: 'Aviator Sunglasses',
    nameFr: 'Lunettes Aviateur',
    nameEs: 'Gafas Aviador',
    description: 'Classic gold-frame aviator sunglasses.',
    descriptionEn: 'Classic gold-frame aviator sunglasses with gradient UV400 lenses. Timeless style for all faces.',
    descriptionFr: 'Classiques lunettes de soleil aviateur à monture dorée avec verres dégradés UV400. Style intemporel pour tous les visages.',
    descriptionEs: 'Clásicas gafas de sol aviador con montura dorada y lentes degradadas UV400. Estilo atemporal para todos los rostros.',
    price: 139.99,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'],
    category: 'SUNGLASSES',
    gender: 'UNISEX',
    stock: 35,
    featured: false,
  },
  {
    name: 'Structured Tote Bag',
    nameEn: 'Structured Tote Bag',
    nameFr: 'Sac Cabas Structuré',
    nameEs: 'Bolso Tote Estructurado',
    description: 'Premium structured leather tote bag for women.',
    descriptionEn: 'Premium structured vegan leather tote bag with gold hardware. Spacious interior with zip pocket.',
    descriptionFr: 'Sac cabas en cuir végétalien structuré premium avec quincaillerie dorée. Intérieur spacieux avec poche zippée.',
    descriptionEs: 'Bolso tote premium de cuero vegano estructurado con herrajes dorados. Interior espacioso con bolsillo con cremallera.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
    category: 'BAGS',
    gender: 'WOMEN',
    stock: 14,
    featured: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@123456',
    12
  );

  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@aurelius.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@aurelius.com',
      password: hashedPassword,
      name: 'Aurelius Admin',
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // Create products
  for (const product of sampleProducts) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${sampleProducts.length} products created`);
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
