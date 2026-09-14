@echo off
color 0D
title EAR OS - Ingestor Maestro de Obsidian

echo ======================================================================
echo           INGESTOR MAESTRO OMNI-DRIVE (PUENTE A OBSIDIAN)
echo ======================================================================
echo.
echo Este proceso va a inyectar tus 362,498 archivos en tu boveda de Obsidian
echo usando la arquitectura "Mapas de Contenido Virtuales" (Cero Saturacion).
echo.
echo Se agruparan los archivos por su carpeta original. Cada grupo tendra su
echo propia nota. Si un grupo tiene mas de 2,000 archivos, se paginara para 
echo que Obsidian no se congele al abrirlo.
echo.
echo ADVERTENCIA: Asegurate de tener Obsidian cerrado durante este proceso
echo para evitar conflictos de indexacion.
echo.
echo ======================================================================
pause

echo.
echo Iniciando escaneo topologico e inyeccion...
echo.

python scripts\unified\build_obsidian_master_index.py

echo.
echo ======================================================================
echo INGESTA COMPLETADA. 
echo Ahora puedes abrir Obsidian. Busca la nueva carpeta "Omni-Index_Master".
echo ======================================================================
pause
