/**
 * Polls routes module
 * Following the established patterns from run-b-chat-only API
 */

const express = require('express');
const { validatePoll, validatePagination } = require('../middleware/validation');

const router = express.Router();

// In-memory storage for polls (in production, this would be a database service)
let polls = [
  {
    id: 1,
    question: 'What is your favorite programming language?',
    description: 'Help us understand the community preferences',
    options: [
      { id: 1, text: 'JavaScript', votes: 15 },
      { id: 2, text: 'Python', votes: 12 },
      { id: 3, text: 'TypeScript', votes: 8 },
      { id: 4, text: 'Go', votes: 5 }
    ],
    totalVotes: 40,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    question: 'Which framework do you prefer for frontend development?',
    description: 'Share your experience with different frameworks',
    options: [
      { id: 5, text: 'React', votes: 20 },
      { id: 6, text: 'Vue', votes: 10 },
      { id: 7, text: 'Angular', votes: 8 },
      { id: 8, text: 'Svelte', votes: 3 }
    ],
    totalVotes: 41,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * @route   GET /api/polls
 * @desc    Get all polls with pagination and search
 * @access  Public
 */
router.get('/', validatePagination, (req, res) => {
  try {
    const { page = 1, limit = 10, search, status = 'active', sortBy = 'createdAt', order = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let filteredPolls = [...polls];
    
    // Filter by status
    if (status) {
      filteredPolls = filteredPolls.filter(poll => poll.status === status);
    }
    
    // Search functionality
    if (search) {
      filteredPolls = filteredPolls.filter(poll => 
        poll.question.toLowerCase().includes(search.toLowerCase()) ||
        (poll.description && poll.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Sorting
    filteredPolls.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedPolls = filteredPolls.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        polls: paginatedPolls,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredPolls.length / limitNum),
          totalItems: filteredPolls.length,
          itemsPerPage: limitNum,
          hasNextPage: endIndex < filteredPolls.length,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: 'Failed to fetch polls' 
    });
  }
});

/**
 * @route   POST /api/polls
 * @desc    Create a new poll
 * @access  Public
 */
router.post('/', validatePoll, (req, res) => {
  try {
    const { question, description, options } = req.body;
    
    const newPoll = {
      id: polls.length > 0 ? Math.max(...polls.map(poll => poll.id)) + 1 : 1,
      question: question.trim(),
      description: description ? description.trim() : '',
      options: options.map((option, index) => ({
        id: polls.length > 0 ? Math.max(...polls.flatMap(p => p.options.map(o => o.id))) + index + 1 : index + 1,
        text: option.text.trim(),
        votes: 0
      })),
      totalVotes: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    polls.push(newPoll);
    
    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: newPoll
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: 'Failed to create poll' 
    });
  }
});

/**
 * @route   GET /api/polls/:id
 * @desc    Get poll by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const poll = polls.find(poll => poll.id === id);
    
    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Poll with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: poll
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: 'Failed to fetch poll' 
    });
  }
});

/**
 * @route   POST /api/polls/:id/votes
 * @desc    Submit a vote for a poll
 * @access  Public
 */
router.post('/:id/votes', (req, res) => {
  try {
    const pollId = parseInt(req.params.id);
    const { optionId } = req.body;
    
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Poll with ID ${pollId} not found`
      });
    }
    
    if (poll.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Cannot vote on inactive poll'
      });
    }
    
    const option = poll.options.find(o => o.id === optionId);
    if (!option) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: `Option with ID ${optionId} not found`
      });
    }
    
    // Increment vote count
    option.votes += 1;
    poll.totalVotes += 1;
    poll.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Vote submitted successfully',
      data: {
        pollId: poll.id,
        optionId: option.id,
        totalVotes: poll.totalVotes
      }
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: 'Failed to submit vote' 
    });
  }
});

module.exports = router;
