from flask import Blueprint, request, jsonify
from services.flashcard_genarator import generate_flashcards

flashcard_bp= Blueprint("flashcards", __name__)

@flashcard_bp.route("/generate-flashcards", methods=["POST"])
def generate_flashcards_route():
    data = request.get_json
    summary = data.get("summary")

    if not summary:
        return jsonify({"error" : "No summary text provided"}), 400
    
    flashcards = generate_flashcards(summary)

    return jsonify({
        "flashcards" : flashcards
    })