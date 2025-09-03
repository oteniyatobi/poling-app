import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

export const CreatePoll = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Poll</CardTitle>
          <CardDescription>
            This feature is coming soon! For now, you can vote on existing polls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              The poll creation form will be implemented here with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Question input field</li>
              <li>Dynamic options (add/remove)</li>
              <li>Form validation with Zod</li>
              <li>API integration for saving polls</li>
            </ul>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Polls
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
