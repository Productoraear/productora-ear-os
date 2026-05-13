import imaplib
import email
from email.header import decode_header
import os
from datetime import datetime
import re

# Tu correo
EMAIL = "edwinagudelomariachi@gmail.com"

# TU CONTRASEÑA DE 16 CARACTERES AQUÍ
PASSWORD = "elqfwaccmindsqnx"

# Búsquedas
SEARCHES = [
    'FROM "Amplify Media"',
    'FROM "Amplify News"',
    'FROM "Momentum"',
    'FROM "La Bombilla"',
    'FROM "Influence"',
    'FROM "Velocity"',
]

# Carpeta salida
OUTPUT_FOLDER = os.path.join(os.path.expanduser("~"), "Desktop", "Correos_Amplify_Extraidos")

def limpiar_texto(texto):
    if texto is None:
        return "Sin_asunto"
    if isinstance(texto, bytes):
        try:
            texto = texto.decode('utf-8', errors='ignore')
        except:
            texto = str(texto)
    texto = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', str(texto))
    return texto[:80].strip()

def crear_carpeta():
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
        print(f"✓ Carpeta creada: {OUTPUT_FOLDER}")
    else:
        print(f"✓ Carpeta ya existe: {OUTPUT_FOLDER}")

def conectar_gmail():
    print("\n🔐 Conectando a Gmail...")
    try:
        imap = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        imap.login(EMAIL, PASSWORD)
        print("✅ Conexión exitosa!")
        return imap
    except imaplib.IMAP4.error as e:
        print(f"\n❌ ERROR DE AUTENTICACIÓN")
        print(f"Detalles: {e}")
        print("\n⚠️ Verifica:")
        print("1. La contraseña de aplicación (16 caracteres)")
        print("2. IMAP está habilitado en Gmail")
        return None
    except Exception as e:
        print(f"\n❌ ERROR DE CONEXIÓN: {e}")
        return None

def buscar_correos(imap, criterio):
    print(f"\n🔍 Buscando: {criterio}")
    try:
        imap.select("INBOX", readonly=True)
        status, messages = imap.search(None, criterio)
        
        if status != "OK":
            print(f"   ⚠️ No se pudo buscar")
            return []
        
        email_ids = messages[0].split()
        print(f"   ✓ Encontrados: {len(email_ids)} correos")
        return email_ids
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return []

def extraer_contenido(msg):
    contenido = ""
    
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            
            if "attachment" in content_disposition:
                continue
            
            if content_type == "text/plain":
                try:
                    payload = part.get_payload(decode=True)
                    if payload:
                        contenido += payload.decode('utf-8', errors='ignore') + "\n\n"
                except:
                    pass
            elif content_type == "text/html":
                try:
                    payload = part.get_payload(decode=True)
                    if payload:
                        html_content = payload.decode('utf-8', errors='ignore')
                        contenido += "\n[CONTENIDO HTML]\n" + html_content + "\n\n"
                except:
                    pass
    else:
        try:
            payload = msg.get_payload(decode=True)
            if payload:
                contenido += payload.decode('utf-8', errors='ignore')
        except:
            pass
    
    return contenido

def procesar_correo(imap, email_id, contador):
    try:
        status, msg_data = imap.fetch(email_id, "(RFC822)")
        
        if status != "OK":
            return None
        
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)
        
        subject_header = msg.get("Subject", "Sin asunto")
        subject_decoded = decode_header(subject_header)[0]
        subject = subject_decoded[0]
        if isinstance(subject, bytes):
            subject = subject.decode('utf-8', errors='ignore')
        
        from_header = msg.get("From", "Desconocido")
        date_header = msg.get("Date", "Fecha desconocida")
        
        contenido_completo = f"""{'='*80}
ASUNTO: {subject}
DE: {from_header}
FECHA: {date_header}
{'='*80}

{extraer_contenido(msg)}

{'='*80}
FIN DEL CORREO
{'='*80}
"""
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        nombre_limpio = limpiar_texto(subject)
        nombre_archivo = f"{contador:04d}_{timestamp}_{nombre_limpio}.txt"
        
        ruta_completa = os.path.join(OUTPUT_FOLDER, nombre_archivo)
        with open(ruta_completa, "w", encoding="utf-8") as f:
            f.write(contenido_completo)
        
        return nombre_archivo
        
    except Exception as e:
        print(f"      ❌ Error: {str(e)[:50]}")
        return None

def main():
    print("\n" + "="*80)
    print("       EXTRACTOR MASIVO DE CORREOS - AMPLIFY MEDIA")
    print("="*80)
    
    crear_carpeta()
    
    imap = conectar_gmail()
    if not imap:
        return
    
    todos_los_ids = set()
    total_correos = 0
    contador_global = 1
    
    for criterio in SEARCHES:
        email_ids = buscar_correos(imap, criterio)
        
        if len(email_ids) == 0:
            continue
        
        print(f"\n   📥 Extrayendo correos...")
        for i, email_id in enumerate(email_ids, 1):
            if email_id in todos_los_ids:
                continue
            todos_los_ids.add(email_id)
            
            nombre_archivo = procesar_correo(imap, email_id, contador_global)
            if nombre_archivo:
                print(f"      [{contador_global}] ✓ {nombre_archivo[:60]}...")
                contador_global += 1
                total_correos += 1
    
    imap.close()
    imap.logout()
    
    print("\n" + "="*80)
    print(f"✅ PROCESO COMPLETADO")
    print(f"\n📊 Estadísticas:")
    print(f"   • Total extraídos: {total_correos}")
    print(f"   • Ubicación: {OUTPUT_FOLDER}")
    print("="*80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrumpido por el usuario")
    except Exception as e:
        print(f"\n\n❌ ERROR: {e}")
