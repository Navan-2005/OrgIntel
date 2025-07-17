from flask import Flask
from routes.summarize_routes import summarize_bp
from routes.flashcard_routes import flashcard_bp

app = Flask(__name__)

app.register_blueprint(summarize_bp)
app.register_blueprint(flashcard_bp)

if __name__ == "__main__":
    app.run(debug=True)