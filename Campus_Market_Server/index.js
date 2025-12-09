

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const localProducts = require('./products.json');

const app = express();
const port = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?appName=Cluster0`;
const client = new MongoClient(uri, {});


let productCollection, userCollection, chatCollection;
async function initDb() {
  try {
    await client.connect();
    const db = client.db('CampusMarket');
    productCollection = db.collection('products');
    userCollection = db.collection('users');
    chatCollection = db.collection('chats');
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log('MongoDB connection failed. Using local fallback data.');
  }
}
initDb();


app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    if (!user?.email) return res.status(400).send({ message: 'Email is required' });

    const existing = await userCollection.findOne({ email: user.email });
    if (existing) return res.send({ message: 'user already exists' });

    const result = await userCollection.insertOne(user);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    res.send(user || {});
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const update = {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        university: req.body.university,
        avatar: req.body.avatar,
        status: req.body.status || 'offline'
      }
    };
    const result = await userCollection.updateOne({ email }, update, { upsert: true });
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const result = await userCollection.deleteOne({ email });
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/user-by-email/:email', async (req, res) => {
  const email = req.params.email;
  const user = await userCollection.findOne({ email }, { projection: { name: 1, email: 1, avatar: 1, status: 1 } });
  res.send(user || {});
});


app.get('/products', async (req, res) => {
  try {
    const { category, search, sort } = req.query;


    if (productCollection) {
      const q = {};
      if (category && category !== 'All') q.category = category;
      if (search) q.title = { $regex: search, $options: 'i' };

      let sortOption = { createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      if (sort === 'price-high') sortOption = { price: -1 };

      const products = await productCollection.find(q).sort(sortOption).toArray();
      return res.send(products);
    }


    let filtered = [...localProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(lowerSearch));
    }

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.send(filtered);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (productCollection) {
      const product = await productCollection.findOne({ _id: new ObjectId(id) });
      return res.send(product || {});
    }

    const product = localProducts.find(p => p._id === id);
    res.send(product || {});
  } catch (e) {
    res.status(400).send({ message: 'Invalid id' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = req.body;
    product.createdAt = new Date();
    product.views = 0;
    const result = await productCollection.insertOne(product);
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = {
      $set: {
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        condition: req.body.condition,
        description: req.body.description,
        image: req.body.image,
        location: req.body.location,
      }
    };
    const result = await productCollection.updateOne({ _id: new ObjectId(id) }, update);
    res.send(result);
  } catch (e) {
    res.status(400).send({ message: 'Invalid id' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (e) {
    res.status(400).send({ message: 'Invalid id' });
  }
});

app.get('/my-products/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const products = await productCollection.find({ sellerEmail: email }).toArray();
    res.send(products);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/products/:id/view', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productCollection.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
    res.send(result);
  } catch (e) {
    res.status(400).send({ message: 'Invalid id' });
  }
});


app.get('/', (req, res) => res.send('Campus Market Server is running'));

app.get('/db-status', (req, res) => {
  res.send({ connected: !!productCollection, usingFallback: !productCollection });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Verifying DB connection (Attempt 2)...');
});
