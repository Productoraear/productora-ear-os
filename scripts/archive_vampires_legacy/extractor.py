import os
import json
import html
import concurrent.futures
from bs4 import BeautifulSoup
from tqdm import tqdm

# --- CONFIGURACIÓN ---
DIRECTORIOS_A_BUSCAR = ['.'] # Busca en el directorio actual
NOMBRE_ARCHIVO_SALIDA = 'proveedores.json'
NOMBRE_ARCHIVO_ERRORES = 'errores_extraccion.log'
NUM_TRABAJADORES = 10 # Número de archivos a procesar en paralelo
# --- FIN CONFIGURACIÓN ---

def limpiar_texto(texto):
    """Limpia y decodifica el texto extraído del HTML."""
    if texto:
        # Decodifica entidades HTML (ej: &amp; -> &) y elimina espacios extra
        return html.unescape(texto.strip())
    return None

def procesar_archivo(ruta_archivo):
    """
    Procesa un único archivo HTML, extrae los datos del proveedor y los devuelve.
    Devuelve None si hay un error.
    """
    try:
        with open(ruta_archivo, 'r', encoding='utf-8', errors='ignore') as f:
            contenido = f.read()

        soup = BeautifulSoup(contenido, 'html.parser')

        # --- Extracción de datos ---
        # Usamos .select_one para encontrar un elemento y obtener su texto de forma segura
        company_name_element = soup.select_one('h1.summary.entry-title')
        company_name = limpiar_texto(company_name_element.text if company_name_element else None)

        # Si no hay nombre de empresa, es un archivo inválido, lo saltamos.
        if not company_name:
            return None

        # Diccionario para guardar los datos del proveedor
        proveedor = {'companyName': company_name}

        # Extraer otros campos
        # Para cada campo, buscamos el 'dt' y luego su hermano 'dd'
        info_items = soup.select('dl.fn-g-info > dt')
        for item in info_items:
            label = limpiar_texto(item.text)
            value_element = item.find_next_sibling('dd')
            value = limpiar_texto(value_element.text if value_element else None)

            if label and value:
                # Mapeo de etiquetas a claves del JSON
                if 'Teléfono' in label:
                    proveedor['phone'] = value
                elif 'Dirección' in label:
                    proveedor['address'] = value
                elif 'Localidad' in label:
                    proveedor['city'] = value
                elif 'Código Postal' in label:
                    proveedor['zipCode'] = value
                elif 'Provincia' in label:
                    proveedor['province'] = value
                elif 'Sitio web' in label:
                    # A veces el 'a' está dentro del 'dd'
                    web_link = value_element.find('a')
                    proveedor['website'] = web_link['href'] if web_link else value

        # Extraer descripción
        description_element = soup.select_one('div.description')
        if description_element:
            # Unimos todos los párrafos de la descripción
            paragraphs = [p.text for p in description_element.find_all('p')]
            proveedor['description'] = limpiar_texto(" ".join(paragraphs))

        return proveedor

    except Exception as e:
        # Si algo falla, devolvemos la ruta del archivo y el error
        return (ruta_archivo, str(e))

def main():
    """
    Función principal que orquesta la extracción de datos.
    """
    print("--- Iniciando Extractor de Proveedores v2.0 (Premium) ---")
    
    archivos_a_procesar = []
    for directorio in DIRECTORIOS_A_BUSCAR:
        for root, _, files in os.walk(directorio):
            for file in files:
                if file.endswith('.htm'):
                    archivos_a_procesar.append(os.path.join(root, file))

    if not archivos_a_procesar:
        print("¡Error! No se encontraron archivos .htm en los directorios especificados.")
        return

    print(f"Se encontraron {len(archivos_a_procesar)} archivos .htm para procesar.")
    
    proveedores_extraidos = []
    errores = []

    # Usamos ThreadPoolExecutor para procesar archivos en paralelo
    # y tqdm para mostrar una barra de progreso
    with concurrent.futures.ThreadPoolExecutor(max_workers=NUM_TRABAJADORES) as executor:
        # Creamos un mapa de futuros (tareas en ejecución)
        future_to_file = {executor.submit(procesar_archivo, ruta): ruta for ruta in archivos_a_procesar}
        
        # Procesamos los resultados a medida que se completan
        for future in tqdm(concurrent.futures.as_completed(future_to_file), total=len(archivos_a_procesar), desc="Procesando proveedores"):
            resultado = future.result()
            if resultado:
                if isinstance(resultado, tuple): # Es un error
                    errores.append(resultado)
                else: # Es un proveedor
                    proveedores_extraidos.append(resultado)

    print(f"\nProceso finalizado. Se extrajeron {len(proveedores_extraidos)} proveedores con éxito.")
    
    # Guardar los datos extraídos en el archivo JSON
    if proveedores_extraidos:
        with open(NOMBRE_ARCHIVO_SALIDA, 'w', encoding='utf-8') as f:
            json.dump(proveedores_extraidos, f, indent=4, ensure_ascii=False)
        print(f"Datos guardados correctamente en '{NOMBRE_ARCHIVO_SALIDA}'")

    # Guardar los errores en el archivo de log
    if errores:
        print(f"Se encontraron {len(errores)} errores durante la extracción.")
        with open(NOMBRE_ARCHIVO_ERRORES, 'w', encoding='utf-8') as f:
            f.write("Archivos que fallaron durante el proceso de extracción:\n")
            for ruta_archivo, error_msg in errores:
                f.write(f"Archivo: {ruta_archivo}\nError: {error_msg}\n---\n")
        print(f"Los detalles de los errores se han guardado en '{NOMBRE_ARCHIVO_ERRORES}'")

if __name__ == '__main__':
    main()