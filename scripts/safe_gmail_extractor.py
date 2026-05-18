import os.path
import base64
from email import message_from_bytes
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# --- CONFIGURACIÓN ---
# 1. Define los permisos que solicitará el script.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
# 2. Define las palabras clave a buscar en tu Gmail.
SEARCH_QUERY = 'incubadora OR velocity OR momentum'
# 3. Carpeta donde se guardarán los resultados.
OUTPUT_DIR = 'gmail_extract'

def main():
    """
    Script seguro para autenticarse en Gmail, buscar correos y guardarlos.
    Utiliza un flujo OAuth 2.0 para evitar el uso de contraseñas.
    """
    creds = None
    # El archivo token.json almacena los tokens de acceso y actualización del usuario.
    # Se crea automáticamente la primera vez que se completa el flujo de autorización.
    if os.path.exists('scripts/token.json'):
        creds = Credentials.from_authorized_user_file('scripts/token.json', SCOPES)
    
    # Si no hay credenciales (válidas), permitir al usuario que inicie sesión.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # IMPORTANTE: Requiere el archivo credentials.json descargado de Google Cloud Console.
            flow = InstalledAppFlow.from_client_secrets_file(
                'scripts/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Guardar las credenciales para la próxima ejecución
        with open('scripts/token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        # Construir el servicio de la API de Gmail
        service = build('gmail', 'v1', credentials=creds)

        # Buscar los correos que coincidan con la query
        print(f"[*] Buscando correos con la query: '{SEARCH_QUERY}'...")
        result = service.users().messages().list(userId='me', q=SEARCH_QUERY).execute()
        messages = result.get('messages', [])

        if not messages:
            print("[-] No se encontraron correos que coincidan con la búsqueda.")
            return

        print(f"[+] Se encontraron {len(messages)} correos. Procesando...")

        # Crear el directorio de salida si no existe
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)

        # Procesar cada mensaje
        for msg in messages:
            txt = service.users().messages().get(userId='me', id=msg['id'], format='raw').execute()
            raw_email = base64.urlsafe_b64decode(txt['raw'].encode('ASCII'))
            email_message = message_from_bytes(raw_email)
            
            subject = str(email_message['Subject'])
            # Crear un nombre de archivo seguro
            safe_subject = "".join([c for c in subject if c.isalpha() or c.isdigit() or c==' ']).rstrip()
            filename = f"{OUTPUT_DIR}/{safe_subject or 'sin_asunto'}_{msg['id']}.eml"
            
            with open(filename, 'wb') as f:
                f.write(raw_email)
            print(f"    -> Guardado: {filename}")

        print(f"\n[✅] Proceso completado. Todos los correos han sido guardados en la carpeta '{OUTPUT_DIR}'.")


    except HttpError as error:
        print(f'Ocurrió un error: {error}')

if __name__ == '__main__':
    main()
