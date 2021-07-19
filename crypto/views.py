from os import EX_NOUSER
from flask import json, render_template, jsonify, request, Response
from crypto import app
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import config
from crypto.dataaccess import DBmanager
from config import *
import sqlite3
from http import HTTPStatus
from datetime import datetime

dbManager = DBmanager(app.config.get("DATABASE"))


symbol = ["EUR", "BTC", "ETH", "XRP", "LTC", "BCH", "BNB", "USDT", "EOS", "BSV", "XLM", "ADA", "TRX"]

@app.route("/")
def home():
  return render_template("home.html")


@app.route("/api/v1/precios")
def precios():
  
  headers = {
  'Accepts': 'application/json',
  'X-CMC_PRO_API_KEY': config.coin_key,
  }

  url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
  parameters = {
    'start':'1',
    'limit':'50',
    'convert':'EUR'
    }

  try:
    json = requests.get(url, params = parameters, headers=headers).json()
    coins = json["data"]

    l = []
    for slug in symbol:
      for coin in coins:
        dic = {}
        if slug == coin["symbol"]:
          dic = {"name":coin["name"], "price":coin["quote"]["EUR"]["price"], "symbol":coin["symbol"], "percent_change_24h":coin["quote"]["EUR"]["percent_change_24h"]}
          l.append(dic)

    return jsonify({"status":"success", "data":l})

  except (ConnectionError, Timeout, TooManyRedirects) as e:
    return jsonify({"status": "fail", "mensaje": str(e)})

@app.route("/transactions")
def transactions():
  return render_template ("transactions.html")


@app.route("/api/v1/movimientos")
def movimientos():
  query = "SELECT * FROM movimientos ORDER BY date;"

  try:
    lista = dbManager.consultaMuchasSQL(query)
    return jsonify ({"status": "success", "movimientos":lista})
  except sqlite3.Error as e:
    return jsonify ({"status": "fail", "mensaje":str(e)})


@app.route('/api/v1/par/<_from>/<_to>/<quantity>')
# @app.route('/api/v1/par/<_from>/<_to>')
def par(_from, _to, quantity = 1.0):
    url = f"https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount={quantity}&symbol={_from}&convert={_to}&CMC_PRO_API_KEY={config.coin_key}"
    res = requests.get(url)

    return Response(res)

@app.route("/api/v1/nuevomov", methods = ["POST"])
def nuevomov():
  
  try:
    if request.method == 'POST':
      now = datetime.now()
      d_string = now.strftime("%d/%m/%Y")
      t_string = now.strftime("%H:%M:%S")

      dicc = (request.json)
      print(dicc['cantidad_from'])

      dbManager.modificaTablaSQL("""
          INSERT INTO movimientos 
          (date, time, moneda_from, cantidad_from, moneda_to, cantidad_to)
          VALUES (?, ?, ?, ?, ?, ?)
          """, [d_string, t_string, dicc['conv_from'], dicc['cantidad_from'], dicc['conv_to'], dicc['cantidad_to']])
      return jsonify({"status": "success", "mensaje": "registro creado"}), HTTPStatus.CREATED

  except sqlite3.Error as e:
    print(e)
    return jsonify({"status": "fail", "mensaje": "Error en base de datos: {}".format(e)}), HTTPStatus.BAD_REQUEST


@app.route("/api/v1/status")
def status():

  cartera = {}
  valor_eur_total_criptos = 0 
  for moneda in symbol:
    query1 = "SELECT sum(cantidad_from) FROM movimientos WHERE moneda_from = '{}'".format(moneda)
    query2 = "SELECT sum(cantidad_to) FROM movimientos WHERE moneda_to = '{}'".format(moneda)

    # need to add try here
    consulta1 = dbManager.consultaMuchasSQL(query1)
    consulta2 = dbManager.consultaMuchasSQL(query2)
  
    inicial = consulta1[0]['sum(cantidad_from)']

    comprado = consulta2[0]['sum(cantidad_to)']

    if moneda == 'EUR':
      if inicial == None and comprado == None:
        invertido = 0
      elif comprado == None:
        invertido =  inicial
      else:
        invertido = inicial - comprado

    else:
      if inicial == None and comprado == None:
          amount = 0
      
      elif inicial == None:
        amount = comprado

      else:
        amount = comprado - inicial 

      if amount != 0:
        try:
          url = f"https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount={amount}&symbol={moneda}&convert=EUR&CMC_PRO_API_KEY={config.coin_key}"
          r = requests.get(url).json()
          euro_value = r["data"]["quote"]["EUR"]["price"]
          valor_eur_total_criptos += euro_value
          
        except (ConnectionError, Timeout, TooManyRedirects) as e:
          return jsonify({"status": "fail", "mensaje": str(e)})

      if amount == 0:
        euro_value = 0

      cartera['{}'.format(moneda)] = {"net": amount, "EUR": euro_value}

    value = {"invertido": invertido, "valor_criptos":valor_eur_total_criptos, "net_profit": valor_eur_total_criptos - invertido}

  return jsonify ({"status": "success", "cartera":cartera, "net_valor": value})



"""
  query1 = "SELECT sum(cantidad_from) FROM movimientos WHERE moneda_from = 'XRP'"
  query2 = "SELECT sum(cantidad_to) FROM movimientos WHERE moneda_to = 'XRP'"

  consulta1 = dbManager.consultaMuchasSQL(query1)
  consulta2 = dbManager.consultaMuchasSQL(query2)

  inicial = consulta1[0]['sum(cantidad_from)']
  canjeado = consulta2[0]['sum(cantidad_to)']

  if canjeado == None:
    invertido = inicial - 0
  
  if canjeado != None:
    invertido = inicial - canjeado
  
  if inicial == None:
    invertido = canjeado
  
  if inicial == None and canjeado = None:
    invertido = 0

"""

