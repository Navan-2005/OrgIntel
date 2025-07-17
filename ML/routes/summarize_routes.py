from flask import Blueprint, request, jsonify
from services.summarizer import generate_summary
from utils.huffman import HuffmanEncoder

summerizer_bp = Blueprint("summerizer", __name__)

@summerizer_bp.route("/summerize-text", methods=["POST"])
def summerize_text():
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error" : "No input text provided"}), 400
    
    # Summarize text
    summary = generate_summary(text)

    # Huffman Encode
    encoder = HuffmanEncoder()
    encoded_data, tree = encoder.encode(summary)

    # Huffman Decode
    decoded_text = encoder.decode(encoded_data, tree)

    return jsonify ({
        "original summary" : summary,
        "compressed_binary" : encoded_data,
        "decoded_text" : decoded_text
    })