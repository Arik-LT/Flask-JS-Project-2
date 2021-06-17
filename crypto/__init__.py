from flask import Flask
from config import *


app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")

from crypto.views import *