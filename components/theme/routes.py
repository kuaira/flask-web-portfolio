from flask import render_template
from . import theme_bp

@theme_bp.route('/themes')
def themes():
    return render_template('themes.html')