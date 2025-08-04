const http = require('http');
const url = require('url');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = 3001;
const URI = "mongodb+srv://badalhalder999:Badal1234@badol-sample-database.cptx8fi.mongodb.net/";
const dbName = 'demo-database';

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Initialize MongoDB connection
connectToMongoDB();

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url, true);
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (pathname === '/api/users' && method === 'GET') {
    const collection = db.collection('user');
    try {
      const users = await collection.find({}).toArray();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end(JSON.stringify({ success: true, data: users }));
    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end(JSON.stringify({ success: false, message: 'Database error' }));
    }
  }

  if (pathname === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const collection = db.collection('user');
        const newUser = { 
          id: data.id,
          name: data.name, 
          email: data.email, 
          age: parseInt(data.age), 
          profession: data.profession, 
          summary: data.summary 
        };
        const result = await collection.insertOne(newUser);
        newUser._id = result.insertedId;
        
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: true, data: newUser }));
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON or Database error' }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/users/') && method === 'GET') {
    try {
      const userId = pathname.split('/')[3];
      const collection = db.collection('user');
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
      if (user) {
        res.end(JSON.stringify({ success: true, data: user }));
      } else {
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
      }
    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end(JSON.stringify({ success: false, message: 'Database error' }));
    }
    return;
  }

  // Update user
  if (pathname.startsWith('/api/users/') && method === 'PUT') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const userId = pathname.split('/')[3];
        const data = JSON.parse(body);
        const collection = db.collection('user');
        
        const updatedUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          age: parseInt(data.age),
          profession: data.profession,
          summary: data.summary
        };

        const result = await collection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: updatedUser }
        );

        if (result.matchedCount > 0) {
          updatedUser._id = new ObjectId(userId);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(JSON.stringify({ success: true, data: updatedUser }));
        } else {
          res.writeHead(404, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
        }
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON or Database error' }));
      }
    });
    return;
  }

  // Delete user
  if (pathname.startsWith('/api/users/') && method === 'DELETE') {
    try {
      const userId = pathname.split('/')[3];
      const collection = db.collection('user');
      
      const result = await collection.deleteOne({ _id: new ObjectId(userId) });
      
      if (result.deletedCount > 0) {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: true, message: 'User deleted successfully' }));
      } else {
        res.writeHead(404, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
      }
    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end(JSON.stringify({ success: false, message: 'Database error' }));
    }
    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify({ success: false, message: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
