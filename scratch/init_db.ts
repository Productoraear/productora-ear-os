import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Checking connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('Connection OK.')
    
    console.log('Enabling pgvector...')
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;')
    console.log('pgvector enabled or already present.')

    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`
    console.log('Current tables:', tables)
  } catch (e: any) {
    console.error('Operation failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
