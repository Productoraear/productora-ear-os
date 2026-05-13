�(import logging
import os
import shutil
import sqlite3
from datetime import datetime

from media_organizer.database import get_db_connection
from media_organizer.config import EVENTOS_DIR, PROCESADOS_DIR

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

def organize_file(file_id):
    """
    Mueve un archivo procesado a su ubicación organizada final
    basándose en su fecha de creación y actualiza la BD.
    
    Args:
        file_id (int): El ID del archivo en la tabla 'files'.
    """
    logging.info(f"[ID:{file_id}] Iniciando organización del archivo.")
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT filename, original_path, creation_date FROM files WHERE id = ?", (file_id,))
        file_data = cursor.fetchone()

        if not file_data:
            logging.error(f"[ID:{file_id}] Archivo no encontrado en la base de datos para organización.")
            return

        filename = file_data['filename']
        original_path = file_data['original_path']
        creation_date_str = file_data['creation_date']

        # Determinar la carpeta de destino
        target_base_dir = EVENTOS_DIR # Por ahora, todo va a EVENTOS
        
        if creation_date_str:
            try:
                # La fecha puede venir en formato "YYYY:MM:DD HH:MM:SS" o "YYYY-MM-DD HH:MM:SS"
                if ':' in creation_date_str.split(' ')[0]: # Detectar formato "YYYY:MM:DD"
                    dt_object = datetime.strptime(creation_date_str, "%Y:%m:%d %H:%M:%S")
                else: # Asumir formato "YYYY-MM-DD"
                    dt_object = datetime.strptime(creation_date_str, "%Y-%m-%d %H:%M:%S")
                
                year_folder = str(dt_object.year)
                month_folder = dt_object.strftime("%m-%B") # Ej. "01-January"
                day_str = dt_object.strftime("%Y-%m-%d")
                
                # --- Lógica de Contexto (Eventos) ---
                # Buscamos si hay un evento registrado para esta fecha
                cursor.execute("SELECT event_name FROM events WHERE event_date = ?", (day_str,))
                event_data = cursor.fetchone()
                
                if event_data:
                    event_name = event_data['event_name'].replace(" ", "_")
                    day_folder = f"{day_str}_{event_name}"
                else:
                    day_folder = day_str
                
                # Nivel de detalle máximo: Subcarpeta con la hora exacta
                time_folder = dt_object.strftime("%Hh-%Mm-%Ss")
                
                # Estructura: EVENTOS/2024/12-December/2024-12-22_Boda_Juan/19h-26m-14s/
                destination_dir = os.path.join(target_base_dir, year_folder, month_folder, day_folder, time_folder)
            except ValueError:
                logging.warning(f"[ID:{file_id}] Fecha de creación '{creation_date_str}' no reconocida. Usando carpeta 'Desconocido'.")
                destination_dir = os.path.join(target_base_dir, "Desconocido")
        else:
            logging.warning(f"[ID:{file_id}] Fecha de creación no disponible. Usando carpeta 'Desconocido'.")
            destination_dir = os.path.join(target_base_dir, "Desconocido")

        os.makedirs(destination_dir, exist_ok=True) # Crear el directorio si no existe

        # Manejar posibles duplicados de nombre de archivo
        new_file_name = filename
        destination_path = os.path.join(destination_dir, new_file_name)
        counter = 1
        while os.path.exists(destination_path):
            name, ext = os.path.splitext(filename)
            new_file_name = f"{name}_{counter}{ext}"
            destination_path = os.path.join(destination_dir, new_file_name)
            counter += 1
        
        # Mover el archivo
        shutil.move(original_path, destination_path)
        logging.info(f"[ID:{file_id}] Archivo movido de '{original_path}' a '{destination_path}'.")

        # Actualizar la base de datos
        cursor.execute("UPDATE files SET processed_path = ?, status = 'organized' WHERE id = ?",
                       (destination_path, file_id))
        conn.commit()
        logging.info(f"[ID:{file_id}] Base de datos actualizada con la nueva ruta y estado 'organized'.")

    except sqlite3.Error as e:
        logging.error(f"[ID:{file_id}] Error de base de datos durante la organización: {e}")
    except FileNotFoundError as e:
        logging.error(f"[ID:{file_id}] Error: El archivo original no existe en '{original_path}': {e}")
    except shutil.Error as e:
        logging.error(f"[ID:{file_id}] Error al mover el archivo: {e}")
    except Exception as e:
        logging.error(f"[ID:{file_id}] Error inesperado durante la organización: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # Ejemplo de uso:
    # Asegúrate de que el archivo con ID 1 exista en la BD y en su original_path
    # organize_file(1)
    print("Módulo de organización de archivos. Diseñado para ser importado.")
�(*cascade082:file:///H:/EAR_OS_MASTER_2026/media_organizer/organizer.py