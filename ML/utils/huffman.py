import heapq
from collections import defaultdict, Counter


class Node:
    def __init__(self, char, freq, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right

    # For priority queue comparison
    def __lt__(self, other):
        return self.freq < other.freq


class HuffmanEncoder:

    def __init__(self):
        self.codes = {}
        self.reverse_mapping = {}

    def _make_frequency_dict(self, text):
        return Counter(text)

    def _build_heap(self, frequency):
        heap = []
        for char in frequency:
            node = Node(char, frequency[char])
            heapq.heappush(heap, node)
        return heap

    def _merge_nodes(self, heap):
        while len(heap) > 1:
            node1 = heapq.heappop(heap)
            node2 = heapq.heappop(heap)
            merged = Node(None, node1.freq + node2.freq, node1, node2)
            heapq.heappush(heap, merged)
        return heap[0] if heap else None

    def _make_codes_helper(self, node, current_code):
        if node is None:
            return

        if node.char is not None:
            self.codes[node.char] = current_code
            self.reverse_mapping[current_code] = node.char
            return

        self._make_codes_helper(node.left, current_code + "0")
        self._make_codes_helper(node.right, current_code + "1")

    def _make_codes(self, root):
        self.codes = {}
        self.reverse_mapping = {}
        self._make_codes_helper(root, "")

    def encode(self, text):
        frequency = self._make_frequency_dict(text)
        heap = self._build_heap(frequency)
        root = self._merge_nodes(heap)
        self._make_codes(root)
        encoded_text = ''.join(self.codes[char] for char in text)
        return encoded_text, root

    def decode(self, encoded_text, root):
        decoded_text = []
        current = root
        for bit in encoded_text:
            current = current.left if bit == '0' else current.right
            if current.char is not None:
                decoded_text.append(current.char)
                current = root
        return ''.join(decoded_text)

    def serialize_tree(self, node):
        if node is None:
            return None
        return {
            "char": node.char,
            "freq": node.freq,
            "left": self.serialize_tree(node.left),
            "right": self.serialize_tree(node.right)
        }
