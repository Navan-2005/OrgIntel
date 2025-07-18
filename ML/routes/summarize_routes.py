from flask import Blueprint, request, jsonify
from services.summarizer import generate_summary, save_summary
from utils.huffman import HuffmanEncoder

summarize_bp = Blueprint("summarizer", __name__)

# Route 1: Summarize text and optionally save it
@summarize_bp.route("/api/summarize", methods=["POST"])  # ✅ Corrected: 'methods' must be lowercase
def summarize():
    data = request.get_json()
    
    # ✅ Corrected: Use data.get() instead of request.get()
    text = data.get("text", "")
    userId=data.get("userId","")
    num_sentences = data.get("num_sentences", 3)
    save = data.get("save", False)
    source = data.get("source", "postman_input")

    summary = generate_summary(text, num_sentence=num_sentences, save=save, source=source)

    if save:
        path = save_summary(summary, source)
        return jsonify({"summary": summary, "saved_to": path})
    return jsonify({"summary": summary})

# Route 2: Summarize and Huffman encode/decode
@summarize_bp.route("/summarize-text", methods=["POST"])
def summarize_text():
    data = request.get_json()
<<<<<<< HEAD
    text = data.get("text", "")
=======
    text = data.get("text","")
>>>>>>> 3c2a16009266659a2bf5833dafd11ecb03c9f919

    if not text:
        return jsonify({"error": "No input text provided"}), 400

    # Generate summary
    summary = generate_summary(text)

    # Huffman encode
    encoder = HuffmanEncoder()
    encoded_data, tree = encoder.encode(summary)

    # Huffman decode
    decoded_text = encoder.decode(encoded_data, tree)

    return jsonify({
        "original_summary": summary,
        "compressed_binary": encoded_data,
        "decoded_text": decoded_text
    })
