from flask import json, render_template, jsonify
from crypto import app
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import config
from crypto.dataaccess import DBmanager
from config import *
import sqlite3

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