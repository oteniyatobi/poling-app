import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Alert, AlertDescription } from './ui/Alert';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';
import { Label } from './ui/Label';

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
  }
];

export const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      selectedOption: ''
    }
  });

  const selectedOption = watch('selectedOption');

  useEffect(() => {
    // Simulate API call to fetch poll
    setTimeout(() => {
      const foundPoll = mockPolls.find(p => p.id === parseInt(id));
      if (foundPoll) {
        setPoll(foundPoll);
        // Check if user has already voted (in real app, check localStorage or user session)
        const hasVoted = localStorage.getItem(`poll_${id}_voted`) === 'true';
        setVoted(hasVoted);
        setShowResults(hasVoted);
      } else {
        setError('Poll not found');
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call to submit vote with better error handling
      const response = await fetch(`/api/polls/${id}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: parseInt(data.selectedOption) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update poll data with optimistic UI update
        const updatedPoll = {
          ...poll,
          options: poll.options.map(option => 
            option.id === parseInt(data.selectedOption)
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1,
          updatedAt: new Date().toISOString()
        };
        
        setPoll(updatedPoll);
        setVoted(true);
        setShowResults(true);
        
        // Mark as voted in localStorage with timestamp
        localStorage.setItem(`poll_${id}_voted`, 'true');
        localStorage.setItem(`poll_${id}_voted_at`, new Date().toISOString());
        
        // Show success message briefly
        setTimeout(() => {
          // Could add a toast notification here
        }, 100);
      } else {
        throw new Error(result.message || 'Failed to submit vote');
      }
      
    } catch (err) {
      console.error('Vote submission error:', err);
      setError(err.message || 'Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getWinningOption = () => {
    if (!poll || poll.options.length === 0) return null;
    return poll.options.reduce((prev, current) => 
      (prev.votes > current.votes) ? prev : current
    );
  };

  const formatVoteCount = (count) => {
    if (count === 1) return '1 vote';
    return `${count} votes`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading poll...</div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/')} 
          className="mt-4"
        >
          Back to Polls
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Back to Polls
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          {poll.description && (
            <CardDescription className="text-base">
              {poll.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!voted && !showResults ? (
            // Voting Form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Label className="text-lg font-medium">Select your answer:</Label>
                <RadioGroup>
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.id.toString()} 
                        id={`option-${option.id}`}
                        {...register('selectedOption', { required: 'Please select an option' })}
                      />
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.selectedOption && (
                  <p className="text-sm text-red-500">
                    {errors.selectedOption.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={!selectedOption || submitting}
                className="w-full"
              >
                {submitting ? 'Submitting Vote...' : 'Submit Vote'}
              </Button>
            </form>
          ) : (
            // Results View
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  {voted ? 'Thank you for voting!' : 'Poll Results'}
                </h3>
                <p className="text-gray-600">
                  Total: {formatVoteCount(poll.totalVotes)}
                </p>
                {getWinningOption() && getWinningOption().votes > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    🏆 Leading: {getWinningOption().text}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {poll.options
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, index) => {
                    const percentage = calculatePercentage(option.votes, poll.totalVotes);
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {index === 0 && option.votes > 0 && '🏆 '}
                            {option.text}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatVoteCount(option.votes)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  View Other Polls
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
