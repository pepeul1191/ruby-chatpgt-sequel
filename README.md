## Base de Datos

Instalar y activar el ambiente virtual - Linux:

    $ sudo apt install python3-virtualenv python3-venv
    $ python3 -m venv ./env
    $ source env/bin/activate

Instalar y activar el ambiente virtual - Windows:

    > pip install virtualenv
    > virtualenv env
    > env\Scripts\activate.bat

Arrancar aplicación:

    $ cd <<carpeta-proyecto>>
    $ pip install -r requirements.txt
    $ mkdir static/uploads
    $ python main.py

## Migraciones

Archivo <b>.env</b>

    DB=sqlite:db/app.db
    SQALCHEMY_CONNECTION_STRING=sqlite:///db/app.db
    ENV=localhost||replit
    OPENAI_API_KEY=xyz

Migraciones con DBMATE - app:

    $ dbmate -d "db/migrations" -e "DB" new <<nombre_de_migracion>>
    $ dbmate -d "db/migrations" -e "DB" up
    $ dbmate -d "db/migrations" -e "DB" rollback

Backup SQLite

    $ sqlite3 app.db .dump > dbname.bak

Ubuntu ruby sequel con sqlite3

    $ sudo apt install ruby-dev
    $ sudo apt install libsqlite3-dev

Ejecutar la aplicación desde <b>config.ru</b>:

    $ rackup

Tareas de <b>Rakefile</b>

    $ rake {task name}

Ejecutar con rerun:

    $ rake dev:start

Sinatra Boilerplate PP:

    https://github.com/pepeul1191/sinatra-boilerplate-4

React PP:

    https://github.com/pepeul1191/react-rollup

---

Fuentes:

+ https://chat.openai.com/c/605a221a-87d7-4798-8783-37ecd465e384
+ https://github.com/sulmanweb/openai_chatgpt