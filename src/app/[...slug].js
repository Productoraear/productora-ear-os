1 | import React from 'react';
2 | import { BespokeTemplate } from '@/components/SClassScreens/BespokeTemplate';
3 | import { DemandEngine } from '@/modules/SClassScreens/DemandEngine';
4 | import { ShieldCheck, Zap, ArrowRight, Globe, Star, Users, BarChart3 } from 'lucide-react';
5 | import Link from 'next/link';
6 | import fs from 'fs';
7 | import path from 'path';
8 | import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';
9 | import { FEATURED_ARTISTS } from '@/data/artists';
10 | import { ROUTES } from '@/lib/routes';
11 | /**
12 |  * 🛠️ UTILIDAD DE FORMATEO (VAMPIRE ENGINE OMEGA)
13 |  */
14 | function formatTitle(slugArray) {
15 |     const lastSegment = slugArray[slugArray.length - 1];
16 |     return lastSegment
17 |         .replace(/-/g, ' ')
18 |         .replace(/\b\w/g, (l) => l.toUpperCase())
19 |         .replace('Ear', 'EAR')
20 |         .replace('Ai', 'IA');
21 | }
22 | /**
23 |  * 🛰️ METADATOS DINÁMICOS (AEO/SEO OMEGA)
24 |  */
25 | export async function generateMetadata({ params }) {
26 |     const { slug } = await params;
27 |     const title = formatTitle(slug);
28 |     const fullPath = slug.join(' / ').toUpperCase();
29 |     return {
30 |         title: `${title} | VIMUME OS Institutional`,
31 |         description: `Infraestructura de autoridad y protocolos institucionales para ${title}. Gestión de programas de impacto y producción de alto nivel en toda España.`,
32 |         keywords: [...slug, 'vimume os', 'productora ear', 'impacto social', 'autoridad institucional'],
33 |         openGraph: {
34 |             title: `${title} - VIMUME OS Authority`,
35 |             description: `Protocolos de excelencia: ${fullPath}. Arquitectura narrativa para el sector público y privado.`,
36 |             images: ['/og-image-vimume.jpg'],
37 |         }
38 |     };
39 | }
40 | /**
41 |  * 🏆 ENRUTADOR UNIVERSAL OMEGA (S-CLASS)
42 |  * Factory Pattern de Renderizado para >2,100 landings.
43 |  */
44 | export default async function UniversalOmegaPage({ params }) {
45 |     const { slug } = await params;
46 |     const title = formatTitle(slug);
47 |     const section = slug[0];
48 |     // 🧪 LÓGICA DE FACTORÍA (S-CLASS RENDERER)
49 |     const isProvincia = PROVINCIAS.includes(slug[0]);
50 |     const isServicio = slug.length === 2 && isProvincia && SERVICIOS.some(s => s.slug === slug[1]);
51 |     // CATEGORÍAS ESPECIALES (S-CLASS VERTICALS)
52 |     const isArsenal = slug[0] === 'arsenal' || slug[0] === 'arsenal-forense';
53 |     const isWeddings = slug[0] === 'weddings' || slug[0] === 'bodas' || slug[0] === 'wedding-planners';
54 |     const isBusiness = slug[0] === 'business' || slug[0] === 'empresarios' || slug[0] === 'ayuntamientos-premium';
55 |     if (isServicio) {
56 |         const province = slug[0];
57 |         const serviceBase = SERVICIOS.find(s => s.slug === slug[1]);
58 |         const service = serviceBase || {
59 |             id: slug[1],
60 |             slug: slug[1],
61 |             nombre: slug[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
62 |             descripcion: `Excelencia técnica en ${slug[1].replace(/-/g, ' ')} para la provincia de ${province}.`,
63 |             keywords: [slug[1], province, 'productora ear', 'eventos premium']
64 |         };
65 |         const isApexRoute = service.id.includes('premium') ||
66 |             service.id.includes('bespoke') ||
67 |             service.slug.includes('boda') ||
68 |             service.slug.includes('wedding') ||
69 |             slug[1].includes('boda');
70 |         return (<BespokeTemplate title={service.nombre} description={service.descripcion} location={province} serviceId={service.id} keywords={service.keywords} isApex={isApexRoute}/>);
71 |     }
72 |     // Renderizado para Ítems del Arsenal o Bodas (Deep Landing)
73 |     if (slug.length >= 2 && (isArsenal || isWeddings || isBusiness)) {
74 |         const itemTitle = slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
75 |         const category = slug[0].toUpperCase();
76 |         return (<BespokeTemplate title={itemTitle} description={`Protocolo de actuación institucional para ${itemTitle}. Autoridad técnica y soporte VIMUME OS certificado.`} location="España" serviceId={slug.join('_')} keywords={[itemTitle, slug[0], 'VIMUME OS', 'Autoridad']} isApex={true}/>);
77 |     }
78 |     // Renderizado de Landing de Provincia o Categoría (S-Class Sales View)
79 |     const isCategory = isArsenal || isWeddings || isBusiness || ['artistas', 'eventos', 'journal'].includes(slug[0]);
80 |     const viewTitle = isCategory ? title : `DOMINANCIA EN ${title.toUpperCase()}`;
81 |     return (<div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 selection:text-white font-inter">
82 |       {/* NAVEGACIÓN BLINDADA */}
83 |       <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-3xl py-5 px-10 flex justify-between items-center border-b border-white/5">
84 |         <Link href="/" className="text-2xl font-black tracking-tighter hover:text-[#ecb613] transition-all uppercase">
85 |           VIMUME<span className="text-[#ecb613]">OS</span>
86 |         </Link>
87 |         <div className="hidden md:flex items-center gap-10 text-[10px] uppercase font-black tracking-[0.3em] text-white/40">
88 |           <Link href="/artistas" className="hover:text-[#ecb613] transition-colors">Artistas</Link>
89 |           <Link href="/eventos" className="hover:text-[#ecb613] transition-colors">Producción</Link>
90 |           <Link href={ROUTES.contacto} className="bg-[#ecb613] text-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform">Contacto</Link>
91 |         </div>
92 |       </nav>
93 | 
94 |       <main className="pt-32 pb-20 space-y-32">
95 |         {/* HERO SALES - IMPACTO S-CLASS */}
96 |         <section className="relative px-6 max-w-7xl mx-auto overflow-hidden">
97 |           <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ecb613]/10 blur-[150px] rounded-full pointer-events-none"/>
98 |           
99 |           <div className="relative z-10 space-y-10">
100 |             <div className="flex items-center gap-4">
101 |               <div className="w-10 h-[1px] bg-[#ecb613]"/>
102 |               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
103 |                 {isCategory ? 'Módulo Institucional' : 'Presencia Territorial'} • {title}
104 |               </span>
105 |             </div>
106 |             
107 |             <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase max-w-5xl">
108 |                 {isCategory ? (<>
109 |                         {title.split(' ')[0]} <br />
110 |                         <span className="text-[#ecb613] italic">{title.split(' ').slice(1).join(' ')}</span>
111 |                     </>) : (<>
112 |                         AUTORIDAD <br />
113 |                         <span className="text-[#ecb613] italic">INSTITUCIONAL</span> <br />
114 |                         EN {title}
115 |                     </>)}
116 |             </h1>
117 | 
118 |             <p className="text-xl md:text-3xl text-white/50 max-w-4xl leading-tight font-light italic">
119 |               {isCategory ? (`Protocolos de impacto y gestión avanzada para la vertical de ${title}. Optimizando cada nodo de servicio.`) : (`"No solo gestionamos proyectos en ${title}. Garantizamos la excelencia operativa mediante el despliegue de protocolos de alta autoridad."`)}
120 |             </p>
121 | 
122 |             <div className="flex flex-col sm:flex-row gap-6 pt-10">
123 |               <Link href="/admin/configurador" className="bg-[#ecb613] text-black px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_50px_rgba(212,168,85,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-4">
124 |                 RESERVAR PROYECTO <Zap className="w-5 h-5"/>
125 |               </Link>
126 |               <Link href="#servicios" className="bg-white/5 border border-white/10 text-white px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 backdrop-blur-xl">
127 |                 CATÁLOGO LOCAL <ArrowRight className="w-5 h-5"/>
128 |               </Link>
129 |             </div>
130 |           </div>
131 |         </section>
132 | 
133 |         {/* PROOF - SOCIAL & TECHNICAL */}
134 |         <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
135 |             {[
136 |             { label: "Impacto en " + title, val: "500+", icon: Star },
137 |             { label: "Clientes VIP", val: "120+", icon: Users },
138 |             { label: "SLA Operativo", val: "99.9%", icon: ShieldCheck },
139 |             { label: "ROI Promedio", val: "+240%", icon: BarChart3 }
140 |         ].map((p, i) => (<div key={i} className="space-y-4 border-l border-white/5 pl-8">
141 |                     <p.icon className="text-[#ecb613]/40" size={24}/>
142 |                     <div>
143 |                         <h3 className="text-4xl font-black text-white tracking-tighter">{p.val}</h3>
144 |                         <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{p.label}</p>
145 |                     </div>
146 |                 </div>))}
147 |         </section>
148 | 
149 |         {/* CONTENIDO ESPECÍFICO (SOLO PARA PROVINCIAS O CATEGORÍAS) */}
150 |         {!isCategory ? (<section id="servicios" className="px-6 max-w-7xl mx-auto space-y-16">
151 |                 <div className="space-y-4">
152 |                     <h2 className="text-4xl font-black uppercase tracking-tighter">Servicios <span className="text-[#ecb613]">Disponibles</span></h2>
153 |                     <div className="h-1 w-20 bg-[#ecb613]"/>
154 |                 </div>
155 | 
156 |                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
157 |                     {SERVICIOS.map((s, i) => (<Link key={i} href={`/${slug[0]}/${s.slug}`} className="group p-10 rounded-[2.5rem] border border-white/5 bg-zinc-950/50 hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden">
158 |                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
159 |                                 <Zap className="w-32 h-32 text-[#ecb613]"/>
160 |                             </div>
161 |                             <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#ecb613] transition-colors">{s.nombre}</h3>
162 |                             <p className="text-sm text-white/40 leading-relaxed font-light mb-8">{s.descripcion}</p>
163 |                             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity">
164 |                                 Ver Detalles <ArrowRight size={12}/>
165 |                             </div>
166 |                         </Link>))}
167 |                 </div>
168 |             </section>) : slug[0] === 'artistas' && (<section id="servicios" className="px-6 max-w-7xl mx-auto space-y-24">
169 |                 {/* 👑 MASTER ARTIST SPOTLIGHT (PACIENTE CERO) */}
170 |                 {FEATURED_ARTISTS.filter(a => a.isStrategicFocus).map((ceo, i) => (<div key={i} className="relative group">
171 |                         <div className="absolute -inset-1 bg-gradient-to-r from-[#ecb613] to-transparent opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"/>
172 |                         <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-950/80 border border-[#ecb613]/20 rounded-[4rem] p-12 overflow-hidden">
173 |                             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
174 |                                 <img src={ceo.image} alt={ceo.name} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"/>
175 |                             </div>
176 |                             <div className="flex flex-col justify-center space-y-8">
177 |                                 <div className="space-y-4">
178 |                                     <div className="flex items-center gap-3">
179 |                                         <span className="px-4 py-1.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black tracking-widest uppercase border border-[#ecb613]/30">
180 |                                             {ceo.status}
181 |                                         </span>
182 |                                         <Globe className="text-white/20" size={16}/>
183 |                                     </div>
184 |                                     <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">
185 |                                         {ceo.name}
186 |                                     </h2>
187 |                                     <p className="text-[#ecb613] font-bold tracking-[0.3em] uppercase text-xs italic">
188 |                                         {ceo.genre}
189 |                                     </p>
190 |                                 </div>
191 |                                 
192 |                                 <p className="text-xl text-white/60 leading-relaxed font-light italic">
193 |                                     "{ceo.desc}"
194 |                                 </p>
195 | 
196 |                                 <div className="grid grid-cols-2 gap-6">
197 |                                     <div className="space-y-2">
198 |                                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Roles</span>
199 |                                         <div className="flex flex-wrap gap-2">
200 |                                             {ceo.roles?.map((r, ri) => (<span key={ri} className="text-[10px] font-bold text-white/40">/ {r}</span>))}
201 |                                         </div>
202 |                                     </div>
203 |                                     <div className="space-y-2">
204 |                                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Location</span>
205 |                                         <p className="text-xs font-bold text-white/40">{ceo.location}</p>
206 |                                     </div>
207 |                                 </div>
208 | 
209 |                                 <button className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.5em] hover:bg-[#ecb613] hover:text-black transition-all">
210 |                                     SOLICITAR COLABORACIÓN
211 |                                 </button>
212 |                             </div>
213 |                         </div>
214 |                     </div>))}
215 | 
216 |                 {/* 🎵 OTROS ARTISTAS */}
217 |                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
218 |                     {FEATURED_ARTISTS.filter(a => !a.isStrategicFocus).map((artist, i) => (<div key={i} className="group space-y-6">
219 |                             <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 grayscale hover:grayscale-0 transition-all">
220 |                                 <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
221 |                             </div>
222 |                             <div className="space-y-2">
223 |                                 <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">{artist.name}</h3>
224 |                                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{artist.genre}</p>
225 |                             </div>
226 |                         </div>))}
227 |                 </div>
228 |             </section>)}
229 | 
230 |         {/* DEMAND ENGINE INTEGRATION */}
231 |         <section className="px-6 max-w-7xl mx-auto space-y-12">
232 |           <div className="flex items-center gap-6">
233 |             <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/20 whitespace-nowrap">Matriz de Demanda Institucional</h2>
234 |             <div className="h-[1px] w-full bg-white/5"/>
235 |           </div>
236 |           <div className="rounded-[4rem] overflow-hidden border border-white/5 shadow-3xl">
237 |             <DemandEngine />
238 |           </div>
239 |         </section>
240 | 
241 |         {/* FINAL CTA */}
242 |         <section className="bg-[#ecb613] py-32 px-6 text-black text-center space-y-12">
243 |             <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
244 |                 LÍDERES EN <br /> {title.toUpperCase()}
245 |             </h2>
246 |             <p className="text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto opacity-70">
247 |                 ¿Su proyecto exige un estándar inalcanzable para la competencia?
248 |             </p>
249 |             <Link href="/admin/configurador" className="inline-block bg-black text-[#ecb613] px-20 py-8 rounded-2xl font-black uppercase text-sm tracking-[0.5em] hover:scale-105 transition-all shadow-2xl">
250 |                 ACTIVAR PROYECTO
251 |             </Link>
252 |         </section>
253 |       </main>
254 | 
255 |       <footer className="py-20 border-t border-white/5 bg-black px-10 flex flex-col md:flex-row justify-between items-center gap-8">
256 |           <div className="text-2xl font-black tracking-tighter">
257 |             VIMUME<span className="text-[#ecb613]">OS</span>
258 |           </div>
259 |           <p className="text-[10px] tracking-[0.5em] text-white/10 uppercase font-black">
260 |             © 2026 VIMUME OS • INSTITUTIONAL INFRASTRUCTURE • {title.toUpperCase()} HUB
261 |           </p>
262 |       </footer>
263 |     </div>);
264 | }
265 | export const dynamicParams = false;
266 | export async function generateStaticParams() {
267 |     const filePath = path.join(process.cwd(), 'public', 'data', 'urls_sitemap.json');
268 |     const allParams = [];
269 |     PROVINCIAS.forEach(p => {
270 |         allParams.push({ slug: [p] });
271 |     });
272 |     PROVINCIAS.forEach(p => {
273 |         SERVICIOS.forEach(s => {
274 |             allParams.push({ slug: [p, s.slug] });
275 |         });
276 |     });
277 |     const criticalRoutes = ['artistas', 'bodas', 'eventos', 'new', 'empresarios', 'arsenal', 'weddings', 'business', 'journal', 'social'];
278 |     criticalRoutes.forEach(route => {
279 |         allParams.push({ slug: [route] });
280 |     });
281 |     try {
282 |         if (fs.existsSync(filePath)) {
283 |             const fileContent = fs.readFileSync(filePath, 'utf-8');
284 |             const urls = JSON.parse(fileContent);
285 |             urls.forEach(url => {
286 |                 try {
287 |                     const pathname = new URL(url).pathname;
288 |                     const isCore = pathname === '/' || pathname.includes('admin') || pathname.includes('api') || pathname.includes('login') || pathname.includes('centro-mando') || pathname.includes('arsenal');
289 |                     if (!isCore) {
290 |                         const pathArray = pathname.split('/').filter(Boolean);
291 |                         const exists = allParams.some(p => p.slug.join('/') === pathArray.join('/'));
292 |                         if (!exists && pathArray.length > 0) {
293 |                             allParams.push({ slug: pathArray });
294 |                         }
295 |                     }
296 |                 }
297 |                 catch (e) {
298 |                     // Ignore invalid URL formatting in sitemap
299 |                 }
300 |             });
301 |         }
302 |     }
303 |     catch (error) {
304 |         console.error("Error en generateStaticParams (Universal):", error);
305 |     }
306 |     return allParams;
307 | }