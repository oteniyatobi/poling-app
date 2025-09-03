import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2 } from 'lucide-react';

// Zod schema for poll validation (matches server-side validation)
const pollSchema = z.object({
  question: z.string()
    .min(1, 'Question is required')
    .max(200, 'Question must be less than 200 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  options: z.array(z.object({
    text: z.string()
      .min(1, 'Option text is required')
      .max(100, 'Option text must be less than 100 characters')
  }))
    .min(2, 'At least 2 options are required')
    .max(10, 'Maximum 10 options allowed')
});

type PollFormData = z.infer<typeof pollSchema>;

interface PollFormProps {
  onSubmit: (data: PollFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const PollForm: React.FC<PollFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: '',
      description: '',
      options: [{ text: '' }, { text: '' }]
    },
    mode: 'onChange'
  });

  const options = watch('options');

  const addOption = () => {
    if (options.length < 10) {
      setValue('options', [...options, { text: '' }], { shouldValidate: true });
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setValue('options', newOptions, { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (data: PollFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a new poll with multiple options for users to vote on.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Question Field */}
          <div className="space-y-2">
            <Label htmlFor="question">Poll Question *</Label>
            <Input
              id="question"
              {...register('question')}
              placeholder="What would you like to ask?"
              className={errors.question ? 'border-red-500' : ''}
              aria-describedby={errors.question ? 'question-error' : undefined}
            />
            {errors.question && (
              <p id="question-error" className="text-sm text-red-500">
                {errors.question.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Add more context about your poll..."
              className={errors.description ? 'border-red-500' : ''}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Options Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 10}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      {...register(`options.${index}.text`)}
                      placeholder={`Option ${index + 1}`}
                      className={errors.options?.[index]?.text ? 'border-red-500' : ''}
                      aria-describedby={errors.options?.[index]?.text ? `option-${index}-error` : undefined}
                    />
                    {errors.options?.[index]?.text && (
                      <p id={`option-${index}-error`} className="text-sm text-red-500 mt-1">
                        {errors.options[index]?.text?.message}
                      </p>
                    )}
                  </div>
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="text-sm text-red-500">
                {errors.options.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
