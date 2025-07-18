from flask import Flask
from routes.summarize_routes import summarize_bp
<<<<<<< HEAD

=======
>>>>>>> 3c2a16009266659a2bf5833dafd11ecb03c9f919
app = Flask(__name__)

app.register_blueprint(summarize_bp)

if __name__ == "__main__":
    app.run(debug=True)