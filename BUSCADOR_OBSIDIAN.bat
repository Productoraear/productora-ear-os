@echo off
color 0B
title EAR OS - Puente Neuronal Obsidian

echo ======================================================================
echo           CENTRO DE COMANDO OMNI-DRIVE (ENLACE A OBSIDIAN)
echo ======================================================================
echo.
echo Has indexado 362,498 Activos de Oro. 
echo Este script creara una nota visual en tu Obsidian con los mejores
echo PDFs y Documentos relacionados a tu busqueda.
echo.
echo ======================================================================

set /p keyword="Introduce la palabra clave (Ej. TENDER B2G, Ayuntamiento, Novia): "

echo.
echo Iniciando escaneo profundo en H:\EAR_GOLDEN_INDEX.csv...
echo.

python scripts\unified\build_obsidian_dashboard_from_index.py "%keyword%"

echo.
echo ======================================================================
echo PROCESO COMPLETADO. Abre tu Obsidian para ver los resultados.
echo ======================================================================
pause
