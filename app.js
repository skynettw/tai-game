const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();
const port = 3000;

const url = "mongodb://player:kg$1234@ks.hopeit.com.tw:27017";
const dbName = 'kgamedb'; // 請確保這是正確的資料庫名稱

let questions = [];
let db;

app.use(express.static('public'));
app.use(express.json());

// 連接到MongoDB並獲取題目
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("成功連接到MongoDB");
    
    db = client.db(dbName);
    const collection = db.collection('items');
    
    questions = await collection.find({}).toArray();
    console.log(`成功從MongoDB獲取 ${questions.length} 個題目`);
  } catch (err) {
    console.error("連接MongoDB時出錯:", err);
  }
}

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 獲取排行榜
app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.collection('leaderboard').find().sort({score: -1}).limit(5).toArray();
    res.json(leaderboard);
  } catch (error) {
    console.error("獲取排行榜時出錯:", error);
    res.status(500).json({error: "獲取排行榜時出錯"});
  }
});

// 添加新的排行榜記錄
app.post('/leaderboard', async (req, res) => {
  try {
    console.log('收到排行榜提交請求:', req.body);
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      console.log('無效的輸入數據:', { name, score });
      return res.status(400).json({ error: "無效的名字或分數" });
    }
    const newRecord = { name, score, date: new Date() };
    console.log('正在插入新記錄:', newRecord);
    const insertResult = await db.collection('leaderboard').insertOne(newRecord);
    console.log('插入結果:', insertResult);
    
    // 保持只有前5名記錄
    const leaderboard = await db.collection('leaderboard').find().sort({score: -1}).limit(6).toArray();
    console.log('當前排行榜:', leaderboard);
    if (leaderboard.length > 5) {
      const deleteResult = await db.collection('leaderboard').deleteOne({_id: leaderboard[5]._id});
      console.log('刪除結果:', deleteResult);
    }
    
    res.status(201).json({message: "成功添加到排行榜"});
  } catch (error) {
    console.error("添加排行榜記錄時出錯:", error);
    res.status(500).json({error: "添加排行榜記錄時出錯: " + error.message});
  }
});

app.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
  connectToMongoDB();
});
