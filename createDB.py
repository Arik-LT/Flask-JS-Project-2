import sqlite3

connection = sqlite3.connect("movimientos.db")

cursor = connection.cursor()

# command1 = "CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY, email TEXT, password TEXT)"

# cursor.execute(command1)

command2 = "CREATE TABLE IF NOT EXISTS movimientos(id INTEGER PRIMARY KEY, date TEXT, time TEXT, moneda_from TEXT, cantidad_from REAL, moneda_to TEXT, cantidad_to REAL)"

cursor.execute(command2)

#cursor.execute("INSERT INTO users VALUES (1, 'ariklevygmailcom', 'a2425')")

# cursor.execute("INSERT INTO movimientos VALUES (1, '2021/06/12', '18:26:30', 'BTC', 0.2, 'ETH', 9)")

connection.commit()

