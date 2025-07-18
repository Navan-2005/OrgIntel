import heapq
import collections

<<<<<<< HEAD
class Node:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
=======
# Define the Node structure using namedtuple
class Node(namedtuple("Node", ["char", "freq", "left", "right"])):
>>>>>>> 3c2a16009266659a2bf5833dafd11ecb03c9f919
    def __lt__(self, other):
        return self.freq < other.freq

class HuffmanEncoder:
<<<<<<< HEAD
    def __init__(self):
        self.codes = {}
        self.reverse_mapping = {}
=======
    def freqMap(self, text):
        freq_map = defaultdict(int)
        for char in text:
            freq_map[char] += 1
        return freq_map

    def huffmanTree(self, freq_map):
        heap = [Node(char, freq, None, None) for char, freq in freq_map.items()]
        heapq.heapify(heap)
>>>>>>> 3c2a16009266659a2bf5833dafd11ecb03c9f919

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

<<<<<<< HEAD
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
=======
        return heap[0] if heap else None

    def buildCodes(self, root):
        codes = {}

        def traverse(node, path):
            if node:
                if node.char is not None:
                    codes[node.char] = path
                traverse(node.left, path + "0")
                traverse(node.right, path + "1")

        traverse(root, "")
        return codes

    def encode(self, text):
        freq_map = self.freqMap(text)
        tree = self.huffmanTree(freq_map)
        codes = self.buildCodes(tree)
        encoded_text = ''.join(codes[char] for char in text)
        return encoded_text, tree

    def decode(self, encoded_text, tree):
        result = []
        node = tree
        for bit in encoded_text:
            node = node.left if bit == "0" else node.right
            if node.char is not None:
                result.append(node.char)
                node = tree
        return ''.join(result)
>>>>>>> 3c2a16009266659a2bf5833dafd11ecb03c9f919
