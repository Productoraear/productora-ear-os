import subprocess
import sys
import time
import os

os.chdir(r"H:\EAR_OS_V2\EAR_OS_V2")
log_out = open(r"H:\EAR_OS_V2\EAR_OS_V2\scripts\nightcrawler_results\stdout.log", "a", encoding="utf-8", buffering=1)
log_err = open(r"H:\EAR_OS_V2\EAR_OS_V2\scripts\nightcrawler_results\stderr.log", "a", encoding="utf-8", buffering=1)

log_out.write(f"\n--- INICIANDO DAEMON NIGHTCRAWLER {time.ctime()} ---\n")
log_out.flush()

process = subprocess.Popen(
    [sys.executable, "-u", r"H:\EAR_OS_V2\EAR_OS_V2\scripts\night_vampire_scraper.py"],
    stdout=log_out,
    stderr=log_err,
    cwd=r"H:\EAR_OS_V2\EAR_OS_V2"
)

print(f"DAEMON_STARTED_PID={process.pid}")
