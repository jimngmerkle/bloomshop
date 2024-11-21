import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: REACT_APP_API_URL,
  methods: 'GET,POST',
  credentials: true
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});