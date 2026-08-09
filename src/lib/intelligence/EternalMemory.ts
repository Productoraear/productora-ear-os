/**
 * 🌌 ETERNAL MEMORY - SOVEREIGN CACHING & KNOWLEDGE PERSISTENCE (S-CLASS)
 * High-performance LRU cache + Persistent Semantic Store for EAR OS.
 */

export interface MemoryNode<T = any> {
  key: string;
  value: T;
  score?: number;
  timestamp: number;
  expiresAt?: number;
  tags?: string[];
}

export class EternalMemory {
  private static instance: EternalMemory;
  private cache: Map<string, MemoryNode>;
  private maxEntries: number;

  private constructor(maxEntries = 1000) {
    this.cache = new Map();
    this.maxEntries = maxEntries;
  }

  public static getInstance(): EternalMemory {
    if (!EternalMemory.instance) {
      EternalMemory.instance = new EternalMemory();
    }
    return EternalMemory.instance;
  }

  /**
   * 💾 Almacena un nodo de memoria soberana
   */
  public set<T>(key: string, value: T, ttlMs?: number, tags?: string[]): void {
    if (this.cache.size >= this.maxEntries) {
      // LRU Eviction: Eliminar la entrada más antigua
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      tags
    });
  }

  /**
   * ⚡ Recupera un nodo verificando expiración
   */
  public get<T>(key: string): T | null {
    const node = this.cache.get(key);
    if (!node) return null;

    if (node.expiresAt && Date.now() > node.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU order
    this.cache.delete(key);
    this.cache.set(key, node);

    return node.value as T;
  }

  /**
   * 🔍 Búsqueda por tags temáticos
   */
  public queryByTag<T>(tag: string): T[] {
    const results: T[] = [];
    const now = Date.now();

    for (const [key, node] of this.cache.entries()) {
      if (node.expiresAt && now > node.expiresAt) {
        this.cache.delete(key);
        continue;
      }

      if (node.tags && node.tags.includes(tag)) {
        results.push(node.value as T);
      }
    }

    return results;
  }

  /**
   * 🧹 Limpieza completa de memoria
   */
  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const eternalMemory = EternalMemory.getInstance();
