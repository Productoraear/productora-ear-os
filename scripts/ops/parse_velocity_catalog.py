import json
import re
from pathlib import Path

raw_text = """
Regístrate al próximo Workshop de LivePro: El Legado[Más información](https://us02web.zoom.us/webinar/register/WN_ijvsywSuTzudaJsKsYqLTA)
[Recomendado](https://space.velocitymedia.info/recommended)[Continuar viendo](https://space.velocitymedia.info/active/courses)[Mi lista](https://space.velocitymedia.info/all/wishlist)
0
Series
[Los Ganadores](https://space.velocitymedia.info/course/62/series)
[Pensar dos veces](https://space.velocitymedia.info/course/76/series)
[Ideas Transformadoras](https://space.velocitymedia.info/course/77/series)
[El Club 10X](https://space.velocitymedia.info/course/78/series)
[La Nueva Productividad](https://space.velocitymedia.info/course/79/series)
[La Máquina de las Ideas](https://space.velocitymedia.info/course/80/series)
[Todas las Series](https://space.velocitymedia.info/browse/category?id=1&category=Series)
Podcasts
Cursos
Cortos
Workshops
VELOCITYMEDIA© 2026
[Términos y condiciones](https://velocitymedia.info/aviso-legal/)[Ayuda](https://velocitymedia.info/soporte/)
Series
Los Ganadores
4 Clases
1h 9m
Los mejores emprendedores piensan como atletas de élite: saben competir, pero sobre todo saben ganar. En esta serie descifram..
Pensar dos veces
3 Clases
48m
Las mejores decisiones no nacen de la velocidad, sino de la lucidez. En esta serie aprendemos a pensar como las mentes que ca..
Ideas Transformadoras
4 Clases
43m
Una sola idea puede partir la realidad en dos. En esta serie, Carles explora las que marcan un antes y un después. En los neg..
El Club 10X
3 Clases
1h 9m
Un club reservado a las ideas que multiplican por diez. Aquí exploramos los conceptos que transforman resultados… y la forma..
La Nueva Productividad
3 Clases
49m
La productividad real no consiste en hacer más, sino en hacer lo que cuenta. Esta serie es una guía para trabajar con foco, c..
La Máquina de las Ideas
4 Clases
1h 14m
Crear buenas ideas no es cuestión de magia, sino de método. En esta serie, diferentes mentes creativas revelan cómo construir..
El Mentalista
8 Clases
2h 6m
Exploramos a fondo las claves del neurobranding que realmente funcionan. En esta serie aprenderás a usar la psicología para c..
Clases de Crecimiento con Alexandra
8 Clases
1h 34m
Cada clase con Alexandra explora un área clave para crecer con más intención. Negocio, carrera, vida: aquí aprendes lo que de..
El Estratega
4 Clases
1h 19m
Pensar estratégicamente es una forma de estar en el mundo. En esta serie, figuras del pasado y del presente nos enseñan cómo..
‹
1
[2](https://space.velocitymedia.info/browse/category?id=1&category=Series&page=2)
[›](https://space.velocitymedia.info/browse/category?id=1&category=Series&page=2)                Regístrate al próximo Workshop de LivePro: El Legado[Más información](https://us02web.zoom.us/webinar/register/WN_ijvsywSuTzudaJsKsYqLTA)
[Recomendado](https://space.velocitymedia.info/recommended)[Continuar viendo](https://space.velocitymedia.info/active/courses)[Mi lista](https://space.velocitymedia.info/all/wishlist)
0
Series
Podcasts
[Accelerate](https://space.velocitymedia.info/course/91/podcasts)
[Sobredemanda](https://space.velocitymedia.info/course/95/podcasts)
[Lo Táctico](https://space.velocitymedia.info/course/96/podcasts)
[La Venta Elegante](https://space.velocitymedia.info/course/97/podcasts)
[Secretos del Mentalista](https://space.velocitymedia.info/course/98/podcasts)
[Disparos](https://space.velocitymedia.info/course/99/podcasts)
[Todos los Podcasts](https://space.velocitymedia.info/browse/category?id=5&category=Podcasts)
Cursos
Cortos
Workshops
VELOCITYMEDIA© 2026
[Términos y condiciones](https://velocitymedia.info/aviso-legal/)[Ayuda](https://velocitymedia.info/soporte/)
Podcasts
Accelerate
12 Clases
2h 51m
Cursos en audio de 15 a 20 minutos para entender lo esencial —y aplicarlo— en las áreas que definen tu negocio.
Sobredemanda
9 Clases
2h 2m
No se trata de vender más, sino de que te persigan. Este podcast te enseña a diseñar una marca y una oferta tan deseables que..
Lo Táctico
29 Clases
3h 2m
Ideas que no se quedan en teoría. En Lo Táctico vas a encontrar acciones concretas para aplicar hoy y mover de verdad los núm..
La Venta Elegante
3 Clases
50m
Vender no es presionar, es entender. En este podcast, Antonio y Marc comparten las claves de cómo vendemos en Despegue: conve..
Secretos del Mentalista
21 Clases
1h 51m
La persuasión no es un truco. Es diseño mental. Este podcast te lleva al centro del neurobranding para entender cómo se const..
Disparos
34 Clases
9h 29m
El podcast mensual donde Alexandra González y Marc Colomer disparan ideas de alto calibre para emprendedores que piensan en s..
Los Sabios
11 Clases
2h 47m
Los sabios de hoy no están en cátedras: construyen, escriben, emprenden. Este podcast recoge sus ideas esenciales para pensar..
El Libro Negro
12 Clases
2h 46m
El Libro Negro revela lo que otros no te dicen sobre marketing, internet y cómo jugar —de verdad— el juego del crecimiento.
Bestseller
16 Clases
5h 32m
Cada mes, Alexandra y Marc destilan la esencia de obras maestras. Porque los libros no están para adornar estanterías, sino p..
‹
1
[2](https://space.velocitymedia.info/browse/category?id=5&category=Podcasts&page=2)
[›](https://space.velocitymedia.info/browse/category?id=5&category=Podcasts&page=2)                                                         Regístrate al próximo Workshop de LivePro: El Legado[Más información](https://us02web.zoom.us/webinar/register/WN_ijvsywSuTzudaJsKsYqLTA)
[Recomendado](https://space.velocitymedia.info/recommended)[Continuar viendo](https://space.velocitymedia.info/active/courses)[Mi lista](https://space.velocitymedia.info/all/wishlist)
0
Series
Podcasts
Cursos
[Midas](https://space.velocitymedia.info/course/70/cursos)
[La venta elegante](https://space.velocitymedia.info/course/71/cursos)
[Copywriting](https://space.velocitymedia.info/course/72/cursos)
[Oportunidades Rápidas](https://space.velocitymedia.info/course/73/cursos)
[De la A a la Z para crear..](https://space.velocitymedia.info/course/74/cursos)
[Estrategias en Facebook A..](https://space.velocitymedia.info/course/75/cursos)
[Todos los Cursos](https://space.velocitymedia.info/browse/category?id=6&category=Cursos)
Cortos
Workshops
VELOCITYMEDIA© 2026
[Términos y condiciones](https://velocitymedia.info/aviso-legal/)[Ayuda](https://velocitymedia.info/soporte/)
Cursos
Midas
17 Clases
1h 32m
En este curso sprint nos enfocamos en crear un plan para tener más rentabilidad y beneficio en tu negocio en los próximos 30..
La venta elegante
10 Clases
1h 12m
En este curso sprint nos enfocamos en cómo ir hacia la llamada de venta perfecta, para tener resultados extraordinarios.
Copywriting
10 Clases
1h 2m
En este curso Sprint nos enfocamos en cómo captar atención con tu copy, comunicar para que se entienda y persuadir para mover..
Oportunidades Rápidas
5 Clases
40m
En este curso Sprint nos enfocamos en darte una visión de cómo encontrar las mejores oportunidades para crecer tu negocio con..
De la A a la Z para crear tu negocio de info producto
6 Clases
1h 22m
De la A a la Z para crear tu negocio de infoproducto.
Estrategias en Facebook Ads
6 Clases
45m
Curso estratégico de Facebook (Meta) para tener una visión panorámica y crear campañas ganadoras rentables en el tiempo.
Funnels
16 Clases
4h 40m
Todos los conocimientos que necesitas para dominar áreas clave que te lleven al crecimiento de tu negocio.
Sprint IA para emprendedores
6 Clases
1h 57m
Curso completo de IA para emprendedores                     Regístrate al próximo Workshop de LivePro: El Legado[Más información](https://us02web.zoom.us/webinar/register/WN_ijvsywSuTzudaJsKsYqLTA)
[Recomendado](https://space.velocitymedia.info/recommended)[Continuar viendo](https://space.velocitymedia.info/active/courses)[Mi lista](https://space.velocitymedia.info/all/wishlist)
0
Series
Podcasts
Cursos
Cortos
[La Jugada](https://space.velocitymedia.info/course/116/cortos)
[Todos los Cortos](https://space.velocitymedia.info/browse/category?id=19&category=Cortos)
Workshops
VELOCITYMEDIA© 2026
[Términos y condiciones](https://velocitymedia.info/aviso-legal/)[Ayuda](https://velocitymedia.info/soporte/)
Cortos
La Jugada
6 Clases
30m
Estrategia pura para la nueva economía                                   Regístrate al próximo Workshop de LivePro: El Legado[Más información](https://us02web.zoom.us/webinar/register/WN_ijvsywSuTzudaJsKsYqLTA)
[Recomendado](https://space.velocitymedia.info/recommended)[Continuar viendo](https://space.velocitymedia.info/active/courses)[Mi lista](https://space.velocitymedia.info/all/wishlist)
0
Series
Podcasts
Cursos
Cortos
Workshops
[Metodología de Atención](https://space.velocitymedia.info/course/88/workshops)
[El ABC para lanzar tu pro..](https://space.velocitymedia.info/course/89/workshops)
[Comunicación Disruptiva](https://space.velocitymedia.info/course/90/workshops)
[AI Copywriting aplicado a..](https://space.velocitymedia.info/course/102/workshops)
[Lo que está funcionando e..](https://space.velocitymedia.info/course/108/workshops)
[Inteligencia Artificial](https://space.velocitymedia.info/course/109/workshops)
[Todos los Workshops](https://space.velocitymedia.info/browse/category?id=14&category=Workshops)
VELOCITYMEDIA© 2026
[Términos y condiciones](https://velocitymedia.info/aviso-legal/)[Ayuda](https://velocitymedia.info/soporte/)
Workshops
Metodología de Atención
2 Clases
1h 4m
Metodología de Marketing de Atención
El ABC para lanzar tu propio infoproducto
2 Clases
3h 26m
El ABC para lanzar tu propio infoproducto
Comunicación Disruptiva
2 Clases
3h 33m
Genera impacto y capta la atención en tu nicho con la estrategia de comunicación disruptiva.
AI Copywriting aplicado a tu negocio
1 Clase
24m
Copywriting + IA
Lo que está funcionando en Marketing
3 Clases
0 seg
Un nuevo taller de LivePro quincenal
Inteligencia Artificial
1 Clase
28m
Taller de Inteligencia Artificial
Diseño de Propuesta Irresistible
1 Clase
26m
Taller de Propuesta Irresistible
"""

# Extract markdown links: [Title](https://space.velocitymedia.info/course/ID/type)
link_pattern = re.compile(r'\[([^\]]+)\]\((https://space\.velocitymedia\.info/course/(\d+)/([^\)]+))\)')
matches = link_pattern.findall(raw_text)

catalog = {}
for title, url, course_id, cat in matches:
    clean_title = title.strip().replace("..", "")
    catalog[clean_title.lower()] = {
        "id": course_id,
        "title": clean_title,
        "category": cat,
        "url": url
    }

# Also parse standalone blocks with "X Clases"
lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
i = 0
while i < len(lines):
    line = lines[i]
    if i + 2 < len(lines) and ("Clase" in lines[i+1] or "Clases" in lines[i+1]):
        title = line
        clases = lines[i+1]
        duracion = lines[i+2]
        desc = lines[i+3] if i + 3 < len(lines) else ""
        key = title.lower()
        if key not in catalog:
            catalog[key] = {
                "title": title,
                "clases": clases,
                "duracion": duracion,
                "descripcion": desc,
                "category": "Unknown"
            }
        else:
            catalog[key]["clases"] = clases
            catalog[key]["duracion"] = duracion
            catalog[key]["descripcion"] = desc
        i += 3
    i += 1

out_path = Path("reports/velocity_media_master_catalog.json")
out_path.parent.mkdir(parents=True, exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(list(catalog.values()), f, indent=2, ensure_ascii=False)

print(f"Total contenidos estructurados: {len(catalog)}")
for item in catalog.values():
    print(f" - [{item.get('category', 'N/A')}] {item['title']} ({item.get('clases', '?')} | {item.get('duracion', '?')}) -> {item.get('url', 'N/A')}")
