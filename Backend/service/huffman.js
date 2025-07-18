class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

class HuffmanDecoder {
  deserializeTree(obj) {
    if (!obj) return null;
    const node = new Node(obj.char, obj.freq);
    node.left = this.deserializeTree(obj.left);
    node.right = this.deserializeTree(obj.right);
    return node;
  }

  decode(binary, tree) {
    let result = "";
    let node = tree;
    for (const bit of binary) {
      node = bit === "0" ? node.left : node.right;
      if (node.char !== null) {
        result += node.char;
        node = tree;
      }
    }
    return result;
  }
}

module.exports = HuffmanDecoder;
