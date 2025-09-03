# AI-Native IDE REST API Demo

This project demonstrates two different approaches to building a REST API using an AI-native IDE (Cursor). You'll experience both inline AI assistance and chat-based project generation.

## 🎯 Project Overview

We've created **two complete REST APIs** using different AI-assisted development approaches:

1. **🏃‍♂️ Run A - Inline Only**: Using ghost completions and real-time AI assistance
2. **💬 Run B - Chat Only**: Using AI chat to generate an entire project scaffold

Both APIs provide the same core functionality (GET /items, POST /items) but with vastly different architectures and feature sets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Cursor IDE (or any AI-native IDE)

### Run A - Inline Only (Port 3000)
```bash
# Navigate to root directory
cd rest-api-demo

# Install dependencies
npm install

# Start the server
npm start

# Test the API
curl http://localhost:3000/items
```

### Run B - Chat Only (Port 3001)
```bash
# Navigate to chat-generated version
cd run-b-chat-only

# Install dependencies
npm install

# Start the server
npm start

# Test the API
curl http://localhost:3001/health
curl http://localhost:3001/items
```

## 📁 Project Structure

```
rest-api-demo/
├── server.js                 # Run A: Inline-only API (Port 3000)
├── package.json             # Run A dependencies
├── README.md               # This file
├── COMPARISON.md           # Detailed comparison
├── run-b-chat-only/        # Run B: Chat-generated API (Port 3001)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Validation middleware
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server
│   ├── package.json        # Run B dependencies
│   ├── env.example         # Environment variables
│   └── README.md           # Run B documentation
└── COMPARISON.md           # Detailed comparison
```

## 🔄 API Endpoints

Both APIs provide these core endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/items` | GET | Retrieve all items |
| `/items` | POST | Create a new item |

### Run A (Basic)
- Simple, single-file implementation
- Basic validation and error handling
- In-memory storage

### Run B (Advanced)
- Modular, production-ready architecture
- Advanced features: pagination, search, sorting
- Enhanced validation and security
- Health check endpoint (`/health`)
- Individual item retrieval (`/items/:id`)

## 🧪 Testing Examples

### Test Run A (Port 3000)
```bash
# Get all items
curl http://localhost:3000/items

# Create new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "Test"}'
```

### Test Run B (Port 3001)
```bash
# Health check
curl http://localhost:3001/health

# Get items with pagination
curl "http://localhost:3001/items?page=1&limit=5"

# Search items
curl "http://localhost:3001/items?search=AI"

# Create new item
curl -X POST http://localhost:3001/items \
  -H "Content-Type: application/json" \
  -d '{"name": "AI Generated Item", "description": "Test"}'
```

## 🎓 Learning Objectives

### AI-Native IDE Experience
1. **Inline Assistance**: Experience real-time AI coding help
2. **Chat Generation**: See how AI can scaffold entire projects
3. **Comparison**: Understand when to use each approach
4. **Best Practices**: Learn AI-assisted development workflows

### Development Skills
1. **REST API Design**: Understand API structure and endpoints
2. **Node.js/Express**: Learn server-side JavaScript development
3. **Project Architecture**: Compare different project structures
4. **Production Readiness**: Understand what makes code production-ready

## 🔍 Key Differences

| Aspect | Run A (Inline) | Run B (Chat) |
|--------|----------------|--------------|
| **Development Speed** | ⚡ Fast | 🐌 Slower |
| **Code Quality** | 🟡 Basic | 🟢 Excellent |
| **Architecture** | 🟡 Single file | 🟢 Modular |
| **Features** | 🟡 Core only | 🟢 Advanced + extras |
| **Production Ready** | ❌ No | ✅ Yes |

## 🚀 Next Steps

After exploring both approaches:

1. **Experiment with Inline**: Try adding new endpoints to Run A
2. **Extend Run B**: Add authentication, database integration, or new features
3. **Hybrid Approach**: Combine both methods in your own projects
4. **Real Projects**: Apply these techniques to actual development work

## 📚 Additional Resources

- [COMPARISON.md](./COMPARISON.md) - Detailed comparison of both approaches
- [Run B README](./run-b-chat-only/README.md) - Comprehensive documentation for the chat-generated version
- [Express.js Documentation](https://expressjs.com/) - Learn more about Express
- [Cursor IDE](https://cursor.sh/) - The AI-native IDE used for this demo

## 🤝 Contributing

Feel free to:
- Add new features to either API
- Improve the documentation
- Share your experiences with AI-native IDEs
- Suggest improvements or new approaches

## 📝 License

MIT License - Feel free to use this code and learnings in your own projects!

---

*This project demonstrates the power of AI-native IDEs in providing flexible, powerful development experiences that can adapt to different project needs and development styles.*
