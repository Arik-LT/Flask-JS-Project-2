# Crypto-Flask-Js-project

<h3> 1. Instalar dependencias </h3>

<p> Instalar las dependecias vistas en el fichero requirements.txt, escribiendo pip install -r requirements.txt en la terminal </p>

<h3> 2. Recrear fichero "environment" .env</h3>

<p> Duplicar el fichero .env_template, renombrarlo .env e informar los campos </p>


<h3> 2.a (opcional) Crear entorno virtual </h3>

<p> 
    en Mac: "python -m venv (nombre entorno)" seguido de ". venv/bin/activate" 
    en Windows: "python -m venv (nombre entorno)" seguido de "(nombre entorno)\Scripts\activate"
</p>

<h3> 3. Crear base de datos </h3>

<p> Lanzar el fichero "createDB.py", guardar este fichero en la carpeta data </p>

<h3> 4. Crear fichero "config.py"</h3>

<p> Crear fichero config.py informando los siguientes campos:
    coin_key = Generaremos nuestra propia key a traves de coin market cap Api, 
    secret_key = Crear una llave secreta
    DATABASE = informar la ruta de la base de datos por ejemplo en mi caso : "data/movimientos.db"
</p>


<h3> Abrir terminal y ejecutar: "flask run" </h3>

