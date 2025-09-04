import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create initial categories
  const categories = [
    {
      name: 'Anxiety',
      description: 'Support and discussions about anxiety, panic attacks, and related concerns',
      color: '#FF6B6B',
      sortOrder: 1
    },
    {
      name: 'Depression',
      description: 'Support for those dealing with depression and mood-related challenges',
      color: '#4ECDC4',
      sortOrder: 2
    },
    {
      name: 'Academic Stress',
      description: 'Discussions about academic pressure, study stress, and educational challenges',
      color: '#45B7D1',
      sortOrder: 3
    },
    {
      name: 'General Support',
      description: 'General peer support and mental health discussions',
      color: '#96CEB4',
      sortOrder: 4
    },
    {
      name: 'Self Care',
      description: 'Tips and discussions about self-care practices and wellness',
      color: '#FFEAA7',
      sortOrder: 5
    }
  ];

  console.log('Seeding categories...');
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });