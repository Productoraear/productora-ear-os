# 🏛️ EAR OS: NÚCLEO DE RAZONAMIENTO CLI (MODO YOLO GOD)
import google.generativeai as genai
import sys
import os

# Configuración de Seguridad y API
API_KEY = "TU_API_KEY_AQUÍ"
genai.configure(api_key=API_KEY)

# Referencias de Soberanía
ASTRA_BRIDGE = "H:/Marketing_Skills/.agent/skills/AstraSkillsBridge.ts"

def invocar_oraculo():
    # El modelo 1.5 Pro gestiona el caché de contexto automáticamente
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    pregunta = " ".join(sys.argv[1:])
    if not pregunta:
        print("❌ Comandante, debe dictar una orden para el EAR OS.")
        return

    # Inyección de instrucciones del Sistema (Manual de Usuario en Español)
    instrucciones = f"""
    Eres el Socio Estratégico de IA de EAR OS. 
    Tu objetivo es generar Asimetría de Información.
    Contexto Local: Tienes las Skills Astra en H: y las Tools de Cascada en los JSON.
    Prioriza siempre el Storyselling y el Moat Estético.
    Responde siempre en ESPAÑOL, usando anglicismos solo cuando sea necesario en (marketing).
    """

    try:
        response = model.generate_content(f"{instrucciones}\n\nORDEN PRIORITARIA: {pregunta}")
        print(f"\n🔱 EAR OS > {response.text}")
    except Exception as e:
        print(f"⚠️ Error en el Nexo: {str(e)}")

if __name__ == "__main__":
    invocar_oraculo()