const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI from the .env file
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(cors());

const database = client.db('unitrack');
const UsersCollection = database.collection('users');

async function connectToMongo() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB!");

    // Return the database object for further use
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

app.get('/', async (req, res) => {
  try {
    const db = await connectToMongo();
    res.send(`Hello, this is your Express server! Message from MongoDB`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password, username } = req.body;

  if (username) {
    // Signup logic
    try {
      const existingUser = await UsersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UsersCollection.insertOne({ email, username, password: hashedPassword });

      return res.status(200).json({ message: 'Signup successful!' });
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Login logic
    try {
      const user = await UsersCollection.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Email not found.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return res.status(200).json({ message: 'Login successful!' });
      } else {
        return res.status(401).json({ error: 'Incorrect password.' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Close the MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
