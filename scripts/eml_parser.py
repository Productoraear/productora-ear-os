import os
import csv
import email
from email.header import decode_header, make_header

# --- CONFIGURACIÓN ---
SOURCE_DIR = 'incubadora'
OUTPUT_FILE = os.path.join(SOURCE_DIR, 'knowledge_base.csv')
CSV_HEADER = ['fecha', 'remitente', 'destinatario', 'asunto', 'cuerpo_texto', 'archivo_origen']

def decode_subject(header):
    """Decodifica el asunto del correo, manejando diferentes codificaciones."""
    if header is None:
        return ""
    decoded_header = decode_header(header)
    return str(make_header(decoded_header))

def get_text_payload(msg):
    """Extrae el cuerpo del texto plano del mensaje de correo."""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))

            if ctype == 'text/plain' and 'attachment' not in cdispo:
                try:
                    payload = part.get_payload(decode=True)
                    # Intentar decodificar con UTF-8, luego con latin-1 como fallback
                    try:
                        return payload.decode('utf-8')
                    except UnicodeDecodeError:
                        return payload.decode('latin-1', 'ignore')
                except Exception:
                    return "" # Devolver vacío si hay error en la decodificación
    else:
        # No es multipart, intentar obtener el payload directamente
        if msg.get_content_type() == 'text/plain':
            try:
                payload = msg.get_payload(decode=True)
                try:
                    return payload.decode('utf-8')
                except UnicodeDecodeError:
                    return payload.decode('latin-1', 'ignore')
            except Exception:
                return ""
    return ""

def main():
    """
    Parsea archivos .eml de un directorio y extrae su contenido a un archivo CSV.
    """
    print(f"[*] Iniciando el parser de inteligencia en el directorio: '{SOURCE_DIR}'")
    
    eml_files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.eml')]

    if not eml_files:
        print(f"[-] No se encontraron archivos .eml en '{SOURCE_DIR}'. Saliendo.")
        return

    print(f"[+] Se encontraron {len(eml_files)} archivos .eml. Procesando...")

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=CSV_HEADER)
        writer.writeheader()

        for filename in eml_files:
            filepath = os.path.join(SOURCE_DIR, filename)
            try:
                with open(filepath, 'rb') as f:
                    msg = email.message_from_binary_file(f)

                subject = decode_subject(msg['Subject'])
                from_ = str(make_header(decode_header(msg['From'])))
                to_ = str(make_header(decode_header(msg['To'])))
                date_ = str(make_header(decode_header(msg['Date'])))
                body = get_text_payload(msg)

                writer.writerow({
                    'fecha': date_,
                    'remitente': from_,
                    'destinatario': to_,
                    'asunto': subject,
                    'cuerpo_texto': body.strip(),
                    'archivo_origen': filename
                })
                print(f"    -> Procesado: {filename}")
            
            except Exception as e:
                print(f"    [!] Error procesando el archivo {filename}: {e}")

    print(f"\n[✅] Proceso completado. La base de conocimiento ha sido creada en: '{OUTPUT_FILE}'")

if __name__ == '__main__':
    main()
