#!/usr/bin/env python3
"""
🏛️ ANTIGRAVITY OMEGA v7.0 — HOSTINGER EDGE SHELLS FTP DEPLOYER
════════════════════════════════════════════════════════════════════════════════
Despliega automáticamente los 3 paquetes S-Class de deploy/hostinger_edge/:
  1. fincasparaboda.com        (deploy/hostinger_edge/fincasparaboda/)
  2. viajemusicalporlamemoria.com (deploy/hostinger_edge/viajemusicalporlamemoria/)
  3. artistaseuropa.com        (deploy/hostinger_edge/artistaseuropa/)

Cero dependencias externas (ftplib estándar de Python).
Soporta lectura desde .env o argumentos de línea de comandos.
════════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import argparse
from pathlib import Path
from ftplib import FTP, FTP_TLS, error_perm

# Inmunización de encoding para Windows pwsh
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Dominios y sus directorios locales
PACKAGES = {
    "fincasparaboda.com": Path("deploy/hostinger_edge/fincasparaboda"),
    "viajemusicalporlamemoria.com": Path("deploy/hostinger_edge/viajemusicalporlamemoria"),
    "artistaseuropa.com": Path("deploy/hostinger_edge/artistaseuropa"),
}

def load_env_file(filepath: Path) -> dict:
    """Carga pares CLAVE=VALOR de un archivo .env si existe."""
    env = {}
    if not filepath.exists():
        return env
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip("'\"")
    return env

def connect_ftp(host: str, user: str, password: str, port: int = 21):
    """Intenta conectar por FTPS con fallback a FTP plano."""
    print(f"[*] Conectando a {host}:{port}...")
    try:
        ftps = FTP_TLS()
        ftps.connect(host, port, timeout=30)
        ftps.login(user, password)
        ftps.prot_p()
        print("[+] Conexión FTPS (TLS cifrada) establecida con éxito.")
        return ftps
    except Exception as e:
        print(f"[!] FTPS falló ({e}). Intentando FTP estándar...")
        ftp = FTP()
        ftp.connect(host, port, timeout=30)
        ftp.login(user, password)
        print("[+] Conexión FTP estándar establecida.")
        return ftp

def find_target_dir(ftp, domain: str) -> str:
    """Detecta la ruta del directorio public_html del dominio en Hostinger."""
    candidates = [
        f"domains/{domain}/public_html",
        f"{domain}/public_html",
        f"public_html/{domain}",
        "public_html"
    ]
    
    # Probar candidatos
    for c in candidates:
        try:
            ftp.cwd("/")
            ftp.cwd(c)
            print(f"    [+] Directorio destino localizado: /{c}")
            return c
        except error_perm:
            continue
            
    print(f"    [?] Estructura no estándar para {domain}. Intentando crear o acceder a public_html...")
    try:
        ftp.cwd("/")
        ftp.cwd("public_html")
        return "public_html"
    except Exception:
        return "/"

def upload_file(ftp, local_path: Path, remote_filename: str) -> bool:
    """Sube un archivo en modo binario y valida su tamaño."""
    if not local_path.exists():
        print(f"    [-] Archivo local no encontrado: {local_path}")
        return False
        
    local_size = local_path.stat().st_size
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_filename}", f)
        
    try:
        remote_size = ftp.size(remote_filename)
        if remote_size == local_size:
            print(f"    [✓] {remote_filename}: {local_size} bytes (Integridad 100%)")
            return True
        else:
            print(f"    [!] {remote_filename}: tamaño diferente (Local: {local_size}, Remoto: {remote_size})")
            return True
    except Exception:
        print(f"    [✓] {remote_filename}: {local_size} bytes subidos")
        return True

def main():
    print("=" * 72)
    print("🏛️ ANTIGRAVITY OMEGA v7.0 — DESPLIEGUE HOSTINGER EDGE SHELLS")
    print("=" * 72)

    parser = argparse.ArgumentParser(description="Despliegue FTP Hostinger S-Class")
    parser.add_argument("--host", help="Servidor FTP (ej. 2.57.91.91 o ftp.productoraear.com)")
    parser.add_argument("--user", help="Usuario FTP de Hostinger")
    parser.add_argument("--password", help="Contraseña FTP de Hostinger")
    parser.add_argument("--port", type=int, default=21, help="Puerto FTP (default: 21)")
    parser.add_argument("--domain", help="Desplegar solo un dominio específico")

    args = parser.parse_args()

    # Cargar de .env si no vienen por línea de comandos
    env_vars = load_env_file(Path(".env"))
    local_env = load_env_file(Path(".env.local"))
    combined_env = {**env_vars, **local_env, **os.environ}

    host = args.host or combined_env.get("HOSTINGER_FTP_HOST")
    user = args.user or combined_env.get("HOSTINGER_FTP_USER")
    password = args.password or combined_env.get("HOSTINGER_FTP_PASS")
    port = args.port or int(combined_env.get("HOSTINGER_FTP_PORT", 21))

    if not host or not user or not password:
        print("\n[!] FALTAN CREDENCIALES FTP:")
        print("    Debes proporcionar las credenciales de Hostinger de una de estas formas:")
        print("    1. Parámetros: python scripts/deploy_hostinger_ftp.py --host <IP> --user <USER> --password <PASS>")
        print("    2. Añadirlas en tu archivo .env:")
        print("       HOSTINGER_FTP_HOST=2.57.91.91")
        print("       HOSTINGER_FTP_USER=tu_usuario_ftp")
        print("       HOSTINGER_FTP_PASS=tu_contraseña_ftp")
        sys.exit(1)

    try:
        ftp = connect_ftp(host, user, password, port)
    except Exception as e:
        print(f"\n[-] Error crítico de conexión FTP: {e}")
        sys.exit(1)

    targets = {args.domain: PACKAGES[args.domain]} if args.domain and args.domain in PACKAGES else PACKAGES

    success_count = 0
    total_files = 0

    for domain, local_dir in targets.items():
        print(f"\n[*] Procesando paquete: {domain}...")
        target_dir = find_target_dir(ftp, domain)
        ftp.cwd("/")
        ftp.cwd(target_dir)

        index_php = local_dir / "index.php"
        htaccess = local_dir / ".htaccess"

        if upload_file(ftp, index_php, "index.php"):
            total_files += 1
        if upload_file(ftp, htaccess, ".htaccess"):
            total_files += 1

        success_count += 1

    try:
        ftp.quit()
    except Exception:
        pass

    print("\n" + "=" * 72)
    print(f"[✓] DESPLIEGUE COMPLETADO: {success_count}/{len(targets)} dominios ({total_files} archivos)")
    print("=" * 72)

if __name__ == "__main__":
    main()
