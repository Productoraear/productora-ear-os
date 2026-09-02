```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Proyecto 'Viaje Musical por la Memoria' - Sitio web dedicado a la musicoterapia enfocada en el bienestar de personas mayores y sus familias.">
    <meta name="keywords" content="musicoterapia, mayores, bienestar, Alzheimer, Parkinson, depresión, intergeneracional, familia, música, terapia, salud mental">
    <title>Viaje Musical por la Memoria</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            background: linear-gradient(135deg, #f2f4f7, #cfd8e4);
            margin: 0;
            padding: 0;
        }
        header, section {
            padding: 20px;
        }
        nav ul {
            list-style-type: none;
            padding: 0;
        }
        nav a {
            text-decoration: none;
            color: #069;
            padding: 10px;
            transition: color 0.3s;
        }
        nav a:hover {
            color: #c0392b;
        }
        .hero-section {
            position: relative;
            text-align: center;
            color: white;
        }
        .hero-section video {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
        }
        .btn-cta {
            background-color: #e74c3c;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }
        .btn-cta:hover {
            