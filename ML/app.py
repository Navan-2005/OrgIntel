from flask import Flask
from routes.summarize_routes import summarize_bp
app = Flask(__name__)

app.register_blueprint(summarize_bp)

if __name__ == "__main__":
    app.run(debug=True)