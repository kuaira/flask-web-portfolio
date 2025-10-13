from flask import Blueprint

theme_bp = Blueprint('theme', __name__, template_folder='templates/theme')