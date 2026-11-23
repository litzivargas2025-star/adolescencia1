=============================================================================
INSTRUCCIONES DE INSTALACIÓN EN XAMPP / WAMP (PHP + MySQL)
Proyecto: Mente Adolescente: Explora y Juega
=============================================================================

1. DESCOMPRIMIR EL ARCHIVO ZIP
   Copia toda la carpeta "mente_adolescente" dentro de:
   - Windows (XAMPP): C:\xampp\htdocs\mente_adolescente
   - Windows (WAMP):  C:\wamp64\www\mente_adolescente
   - Mac/Linux:       /opt/lampp/htdocs/mente_adolescente

2. INICIAR SERVICIOS
   Abre el Panel de Control de XAMPP e inicia "Apache" y "MySQL".

3. IMPORTAR LAS DOS BASES DE DATOS EN phpMyAdmin
   a) Abre tu navegador en: http://localhost/phpmyadmin
   b) Haz clic en la pestaña "Importar" (Import).
   c) Selecciona el archivo: base_de_datos.sql
   d) Haz clic en "Importar" / "Continuar".
   Esto creará automáticamente ambas bases de datos:
   - db_registro_adolescente
   - db_seguimiento_emocional

4. ABRIR EL SITIO WEB
   Entra en: http://localhost/mente_adolescente/

   Cuenta demo precargada para pruebas rápidas:
   - Correo: sofia@mente.edu
   - Contraseña: 123456

5. ESTRUCTURA DE CARPETAS INCLUIDA
   - index.php
   - conexion.php
   - registrar.php
   - login.php
   - panel_usuario.php
   - certificado.php
   - base_de_datos.sql
   - css/main.css
   - js/main.js
   - img/ (miedo.png, 1.png, 2.png, 3.png, 4.svg, tristeza.png, 5.png, 6.png, 7.png, 8.svg, logo.svg, img1.svg - img6.svg)
   - video/ (Frases_inspiradoras_sobre_un_paisaje_pintado_720p_dc33cc01.mp4)
=============================================================================
