# pip install nltk
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import defaultdict
import os
import json
from datetime import datetime

nltk.download('punkt')
nltk.download('stopwords')

def save_summary(summary_text, source="nltk_manual"):
    save_dir = "saved_summaries"
    os.makedirs(save_dir, exist_ok=True)
    timestrap = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{source}_summary_{timestrap}.json"
    filepath = os.path.join(save_dir, filename)

    data = {
        "source" : source,
        "timestrap" : timestrap,
        "summary" : summary_text
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"Sumaary saved to : {filepath}")
    return filepath

def generate_summary(text, num_sentence=3, save=False, source="nltk_manual"):
    sentences = sent_tokenize(text)
    if len(sentences) <= num_sentence:
        return text # Return full text if it's short
    
    stop_words = set(stopwords.words('english'))
    word_freq = defaultdict(int)

    for word in word_tokenize(text.lower()):
        if word.isalpha() and word not in stop_words:
            word_freq[word] += 1

    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                sentence_scores[sentence] = sentence_scores.get(sentence, 0) + word_freq[word]
    
    # Sort sentence by score
    sorted_sentences = sorted(sentence_scores, key = sentence_scores.get, reverse=True)
    summary = ''.join(sorted_sentences[:num_sentence])

    return summary