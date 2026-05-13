import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Creating ear_knowledge_base table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ear_knowledge_base" (
        "id" BIGSERIAL PRIMARY KEY,
        "file_path" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "chunk_index" INTEGER NOT NULL,
        "embedding" vector(768),
        "metadata" JSONB,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ear_knowledge_base_file_path_chunk_index_key" UNIQUE ("file_path", "chunk_index")
      );
    `)
    console.log('Table created or already exists.')

    // Create index for vector search
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ear_knowledge_base_embedding_idx" ON "ear_knowledge_base" 
      USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    `)
    console.log('Vector index created.')

  } catch (e: any) {
    console.error('Operation failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
