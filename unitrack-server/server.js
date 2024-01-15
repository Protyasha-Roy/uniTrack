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
const studentsCollection = database.collection('students');
const attendanceCollection = database.collection('attendance');

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

app.post('/submitForm', async (req, res) => {
  const { roll, sessionYear } = req.body;

  try {
    // Check if student with the same roll and session year already exists
    const existingStudent = await studentsCollection.findOne({ roll, sessionYear });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this roll and session year already exists.' });
    }

    // Insert new student data
    await studentsCollection.insertOne(req.body);

    return res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/checkAttendance', async (req, res) => {
  const { rolls, clubName } = req.body;

  try {
    // Check attendance against the students database
    const mismatchedRolls = await Promise.all(
      rolls.map(async (roll) => {
        const student = await studentsCollection.findOne({
          roll,
          'clubsToJoin': clubName,
        });


        return student ? null : roll;
      })
    );

    // Filter out null values (rolls matched) and keep only mismatched rolls
    const mismatchedRollsFiltered = mismatchedRolls.filter((roll) => roll !== null);

    if (mismatchedRollsFiltered.length === 0) {
      res.send('Rolls matched');
    } else {
      res.json({ mismatchedRolls: mismatchedRollsFiltered });
    }
  } catch (error) {
    console.error('Error checking attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addToAttendance', async (req, res) => {
  try {
    const { rolls, clubName } = req.body;

    // Ensure rolls is an array
    if (Array.isArray(rolls)) {
      // Check if any rolls do not exist in the studentsCollection
      const allStudents = await studentsCollection.find({clubsToJoin: clubName}).toArray();
      const allRolls = allStudents.map(student => student.roll);

      const absentRolls = allRolls.filter(roll => !rolls.includes(roll));
      const presentRolls = rolls;

      // Proceed with adding to attendanceCollection
      const date = new Date();
      await attendanceCollection.insertOne({ presentRolls, absentRolls, clubName, date });

      return res.status(200).json({ message: 'Added to attendance successfully!' });
    } else {
      return res.status(400).json({ error: 'Invalid rolls format' });
    }
  } catch (error) {
    console.error('Error adding to attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
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
