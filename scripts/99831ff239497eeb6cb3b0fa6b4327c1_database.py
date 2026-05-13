Õimport sqlite3
from .config import DATABASE_PATH

def get_db_connection():
    """Crea y retorna una conexi√≥n a la base de datos."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    """Crea las tablas iniciales en la base de datos si no existen."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # --- Tabla de Archivos ---
    # Almacena informaci√≥n intr√≠nseca y de metadatos de cada archivo.
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_path TEXT NOT NULL UNIQUE,
        processed_path TEXT,
        file_type TEXT, -- 'image', 'video', 'audio'
        file_size INTEGER,
        creation_date TIMESTAMP,
        camera_make TEXT,
        camera_model TEXT,
        video_duration REAL, -- en segundos
        status TEXT DEFAULT 'pending', -- pending, processing, completed, error
        processed_at TIMESTAMP
    );
    """)

    # --- Tabla de Tags de IA ---
    # Almacena todos los datos generados por los diferentes modelos de IA.
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER,
        tag_type TEXT NOT NULL, -- 'face', 'object', 'keyword', 'transcript'
        value TEXT NOT NULL,
        confidence REAL, -- Probabilidad del modelo
        source TEXT, -- 'DeepFace', 'YOLO', 'Whisper'
        FOREIGN KEY (file_id) REFERENCES files (id)
    );
    """)

    # --- Tabla de Eventos (Desde Mapas Mentales / Documentos) ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        event_date TEXT NOT NULL, -- Formato YYYY-MM-DD
        description TEXT,
        source_file TEXT
    );
    """)

    conn.commit()
    conn.close()
    print("Tablas 'files', 'ai_tags' y 'events' creadas o ya existentes.")

if __name__ == '__main__':
    # Esto permite ejecutar el script directamente para inicializar la BD
    create_tables()
ù *cascade08ù™*cascade08™Õ *cascade0829file:///H:/EAR_OS_MASTER_2026/media_organizer/database.py