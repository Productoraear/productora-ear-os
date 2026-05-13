import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const STRATEGIC_SECTORS = ["H:\\", "D:\\", "F:\\"];

async function walk(dir: string): Promise<string[]> {
    let files: string[] = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        try {
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                if (!file.includes('node_modules')) files = files.concat(await walk(fullPath));
            } else if (['.txt', '.md', '.json'].includes(path.extname(fullPath).toLowerCase())) {
                files.push(fullPath);
            }
        } catch (e) { }
    }
    return files;
}

async function run() {
    for (const sector of STRATEGIC_SECTORS) {
        const allFiles = await walk(sector);
        for (const filePath of allFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const chunks = content.match(/[\s\S]{1,1000}/g) || [];
                for (let i = 0; i < chunks.length; i++) {
                    await supabase.from('ear_knowledge_base').insert([{
                        content: chunks[i],
                        metadata: { source: path.basename(filePath), path: filePath, sector }
                    }]);
                }
                console.log(`[OK] Ingerido: ${path.basename(filePath)}`);
            } catch (err) { }
        }
    }
}
run();