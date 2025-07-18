import heapq
import collections

class Node:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        return self.freq < other.freq

class HuffmanEncoder:
    def __init__(self):
        self.codes = {}
        self.reverse_mapping = {}

    def _make_frequency_dict(self, text):
        return collections.Counter(text)

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
            merged = Node(None, node1.freq + node2.freq)
            merged.left = node1
            merged.right = node2
            heapq.heappush(heap, merged)
        return heap

    def _make_codes_helper(self, root, current_code):
        if root is None:
            return

        if root.char is not None:
            self.codes[root.char] = current_code
            self.reverse_mapping[current_code] = root.char
            return

        self._make_codes_helper(root.left, current_code + "0")
        self._make_codes_helper(root.right, current_code + "1")

    def _make_codes(self, heap):
        root = heapq.heappop(heap)
        self._make_codes_helper(root, "")
        return root

    def encode(self, text):
        frequency = self._make_frequency_dict(text)
        heap = self._build_heap(frequency)
        heap = self._merge_nodes(heap)
        tree_root = self._make_codes(heap)
        encoded_text = ''.join(self.codes[char] for char in text)
        return encoded_text, tree_root

    def decode(self, encoded_text, tree_root):
        current = tree_root
        decoded_text = ""
        for bit in encoded_text:
            if bit == '0':
                current = current.left
            else:
                current = current.right

            if current.char is not None:
                decoded_text += current.char
                current = tree_root

        return decoded_text
