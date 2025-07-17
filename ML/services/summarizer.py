# pip install nltk
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import deafaultdict

nltk.download('punkt')
nltk.download('stopwords')
def generateSummary(text, num_sentence = 3):
    sentences = sent_tokenize(text)
    if len(sentences) <= num_sentence:
        return text # Return full text if it's short
    
    stop_words = set(stopwords('english'))
    word_freq = deafaultdict(int)

    for word in word_tokenize(text.lower()):
        if word.isalpha() and word not in stop_words:
            word_freq[word_freq] += 1

    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                sentence_scores[sentence] = sentence_scores.get(sentence, 0) + word_freq[word]
    
    # Sort sentence bt score and pick top N
    sorted_sentences = sorted(sentence_scores, key = sentence_scores.get, reverse=True)
    summary = ''.join(sorted_sentences[:num_sentence])

    return summary