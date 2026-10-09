import os
import sys
import base64
import argparse
import json
from email import message_from_bytes
from email.utils import parsedate_to_datetime

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# --- CONFIGURACIÓN ---
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Consulta por defecto orientada a la captación de Dani Aragón (taller online).
# Se puede sobrescribir con --query.
DEFAULT_SEARCH_QUERY = 'from:bedifferent@musicalizza.com OR subject:"Ya estás dentro"'

DEFAULT_OUTPUT_DIR = 'gmail_extract'
CREDENTIALS_PATH = 'scripts/credentials.json'
TOKEN_PATH = 'scripts/token.json'


def load_credentials() -> Credentials:
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_PATH):
                raise FileNotFoundError(
                    f"No existe {CREDENTIALS_PATH}. Descárgalo desde Google Cloud Console "
                    "(OAuth 2.0 Client ID -> Pantalla de consentimiento Gmail readonly)."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_PATH, 'w', encoding='utf-8') as token:
            token.write(creds.to_json())

    return creds


def safe_filename(value: str, fallback: str) -> str:
    cleaned = "".join(
        c for c in value if c.isalnum() or c in (' ', '-', '_')
    ).strip()
    cleaned = " ".join(cleaned.split())
    return cleaned[:120] or fallback


def extract_text(email_message):
    """Extrae el texto plano del cuerpo del email con el mejor esfuerzo."""
    texts = []
    if email_message.is_multipart():
        for part in email_message.walk():
            ctype = part.get_content_type()
            if ctype == 'text/plain':
                payload = part.get_payload(decode=True) or b''
                charset = part.get_content_charset() or 'utf-8'
                try:
                    texts.append(payload.decode(charset, errors='replace'))
                except (LookupError, TypeError):
                    texts.append(payload.decode('utf-8', errors='replace'))
    else:
        payload = email_message.get_payload(decode=True) or b''
        charset = email_message.get_content_charset() or 'utf-8'
        try:
            texts.append(payload.decode(charset, errors='replace'))
        except (LookupError, TypeError):
            texts.append(payload.decode('utf-8', errors='replace'))
    return "\n".join(texts).strip()


def persist_message(raw_email: bytes, service, msg: dict, output_dir: str, write_raw: bool) -> dict:
    email_message = message_from_bytes(raw_email)
    subject = str(email_message['Subject'] or '')
    sender = str(email_message['From'] or '')
    date_raw = email_message['Date'] or ''

    try:
        iso_date = parsedate_to_datetime(date_raw).isoformat()
    except (TypeError, ValueError):
        iso_date = date_raw

    filename_base = safe_filename(subject, 'sin_asunto') or 'sin_asunto'
    record = {
        'id': msg['id'],
        'subject': subject,
        'from': sender,
        'date': iso_date,
        'raw_file': None,
        'text_file': None,
    }

    if write_raw:
        raw_file = os.path.join(output_dir, f"{filename_base}_{msg['id']}.eml")
        with open(raw_file, 'wb') as f:
            f.write(raw_email)
        record['raw_file'] = raw_file

    text = extract_text(email_message)
    if text:
        text_file = os.path.join(output_dir, f"{filename_base}_{msg['id']}.txt")
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(text)
        record['text_file'] = text_file
        record['body'] = text

    return record


def main():
    parser = argparse.ArgumentParser(
        description="Extractor seguro de Gmail vía OAuth 2.0 (read-only)."
    )
    parser.add_argument(
        '--query',
        default=DEFAULT_SEARCH_QUERY,
        help="Consulta Gmail (sintaxis de búsqueda de Gmail)."
    )
    parser.add_argument(
        '--output',
        default=DEFAULT_OUTPUT_DIR,
        help="Directorio de salida."
    )
    parser.add_argument(
        '--max-results',
        type=int,
        default=50,
        help="Número máximo de mensajes a procesar."
    )
    parser.add_argument(
        '--no-raw',
        action='store_true',
        help="No guardar el .eml crudo; solo texto y metadata."
    )
    args = parser.parse_args()

    if not os.path.exists(args.output):
        os.makedirs(args.output)

    creds = load_credentials()
    service = build('gmail', 'v1', credentials=creds)

    print(f"[*] Buscando correos con la query: '{args.query}' ...")
    try:
        result = service.users().messages().list(
            userId='me', q=args.query, maxResults=args.max_results
        ).execute()
    except HttpError as error:
        print(f"[-] Error al buscar correos: {error}")
        sys.exit(1)

    messages = result.get('messages', [])
    if not messages:
        print("[-] No se encontraron correos que coincidan con la búsqueda.")
        return

    print(f"[+] Se encontraron {len(messages)} correos. Procesando...")

    records = []
    for msg in messages:
        txt = service.users().messages().get(
            userId='me', id=msg['id'], format='raw'
        ).execute()
        raw_email = base64.urlsafe_b64decode(txt['raw'].encode('ASCII'))
        record = persist_message(raw_email, service, msg, args.output, write_raw=not args.no_raw)
        records.append(record)
        print(f"    -> Procesado: {record['subject']}")

    report_path = os.path.join(args.output, 'metadata.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Proceso completado. {len(records)} correos guardados en '{args.output}'.")
    print(f"[OK] Metadata consolidada en: {report_path}")


if __name__ == '__main__':
    main()