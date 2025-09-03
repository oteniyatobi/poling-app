import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

// Mock data - in real app this would come from API
const mockPolls = [
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
    createdAt: '2024-01-15T10:00:00Z'
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
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    question: 'What is your preferred development environment?',
    description: 'Tell us about your coding setup',
    options: [
      { id: 9, text: 'VS Code', votes: 25 },
      { id: 10, text: 'WebStorm', votes: 8 },
      { id: 11, text: 'Vim/Neovim', votes: 12 },
      { id: 12, text: 'Sublime Text', votes: 5 }
    ],
    totalVotes: 50,
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPolls(mockPolls);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading polls...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Polls</h1>
        <p className="mt-2 text-gray-600">
          Participate in community polls and see what others think
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">
                {poll.question}
              </CardTitle>
              {poll.description && (
                <CardDescription className="line-clamp-2">
                  {poll.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {poll.options.length} options • {poll.totalVotes} votes
                </div>
                
                <div className="space-y-2">
                  {poll.options.slice(0, 3).map((option) => (
                    <div key={option.id} className="flex justify-between text-sm">
                      <span className="truncate">{option.text}</span>
                      <span className="text-gray-500">{option.votes}</span>
                    </div>
                  ))}
                  {poll.options.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{poll.options.length - 3} more options
                    </div>
                  )}
                </div>

                <Link
                  to={`/polls/${poll.id}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View & Vote
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No polls available</div>
          <Link
            to="/create"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create the first poll
          </Link>
        </div>
      )}
    </div>
  );
};
