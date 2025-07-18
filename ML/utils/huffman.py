from collections import defaultdict, namedtuple
import heapq

# Define the Node structure using namedtuple
class Node(namedtuple("Node", ["char", "freq", "left", "right"])):
    def __lt__(self, other):
        return self.freq < other.freq

class HuffmanEncoder:
    def freqMap(self, text):
        freq_map = defaultdict(int)
        for char in text:
            freq_map[char] += 1
        return freq_map

    def huffmanTree(self, freq_map):
        heap = [Node(char, freq, None, None) for char, freq in freq_map.items()]
        heapq.heapify(heap)

        while len(heap) > 1:
            left = heapq.heappop(heap)
            right = heapq.heappop(heap)
            merged = Node(None, left.freq + right.freq, left, right)
            heapq.heappush(heap, merged)

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
