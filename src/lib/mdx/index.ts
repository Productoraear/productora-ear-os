import fs from 'fs';
import path from 'path';

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  cluster: 'artistas' | 'eventos' | 'empresas';
  author: string;
  slug: string;
  tags?: string[];
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(rawContent: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove outer quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle simple arrays [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
      } else {
        data[key] = value;
      }
    }
  });

  return { data, content };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const clusters: Array<'artistas' | 'eventos' | 'empresas'> = ['artistas', 'eventos', 'empresas'];

  for (const cluster of clusters) {
    const clusterDir = path.join(CONTENT_DIR, cluster);
    if (!fs.existsSync(clusterDir)) continue;

    const files = fs.readdirSync(clusterDir);
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const fileSlug = file.replace(/\.mdx?$/, '');
        if (fileSlug === slug) {
          const filePath = path.join(clusterDir, file);
          const raw = fs.readFileSync(filePath, 'utf-8');
          const { data, content } = parseFrontmatter(raw);

          return {
            meta: {
              title: data.title || fileSlug,
              description: data.description || '',
              date: data.date || new Date().toISOString(),
              cluster: (data.cluster as any) || cluster,
              author: data.author || 'Productora EAR',
              slug: fileSlug,
              tags: Array.isArray(data.tags) ? data.tags : [],
            },
            content,
          };
        }
      }
    }
  }

  return null;
}

export async function getAllPosts(clusterFilter?: 'artistas' | 'eventos' | 'empresas'): Promise<BlogPostMeta[]> {
  const clusters: Array<'artistas' | 'eventos' | 'empresas'> = clusterFilter
    ? [clusterFilter]
    : ['artistas', 'eventos', 'empresas'];

  const posts: BlogPostMeta[] = [];

  for (const cluster of clusters) {
    const clusterDir = path.join(CONTENT_DIR, cluster);
    if (!fs.existsSync(clusterDir)) continue;

    const files = fs.readdirSync(clusterDir);
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const fileSlug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(clusterDir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(raw);

        posts.push({
          title: data.title || fileSlug,
          description: data.description || '',
          date: data.date || new Date().toISOString(),
          cluster: (data.cluster as any) || cluster,
          author: data.author || 'Productora EAR',
          slug: fileSlug,
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
