const HuffmanDecoder = require('../service/huffman')
const axios = require('axios');
const Compression = require('../models/compress');

const decoder=new HuffmanDecoder()

const store=async(req,res)=>{
    const { text, userId } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const pyRes = await axios.post("http://127.0.0.1:5000/api/huffman-compress", { text });
    const { binary, tree } = pyRes.data;
    console.log('result from python : ',pyRes.data);
    console.log('tree : ',tree);
    
    const saved = new Compression({
      binary,
      tree,
      userId,
      originalText: text,
    });
    await saved.save();
    console.log('saved : ',saved);

    res.json({ id: saved._id, binary });
  } catch (err) {
    // console.log('error : ',err);
    
    res.status(500).json({ error: "Failed to fetch from Python API", detail: err.message });
  }
}

const decode=async(req,res)=>{
    const record = await Compression.findById(req.params.id);
  if (!record) return res.status(404).json({ error: "Not found" });

  const tree = decoder.deserializeTree(record.tree);
  const decoded = decoder.decode(record.binary, tree);

  res.json({ decoded, original: record.originalText });
}

module.exports={store,decode}