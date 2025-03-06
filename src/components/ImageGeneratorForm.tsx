import React, { useState } from 'react';
import OpenAI from 'openai';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader, Image as ImageIcon } from 'lucide-react';

// Declare OpenAI client (will initialize on form submission)
let client: OpenAI | null = null;

const ImageGeneratorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    apiKey: '',
    baseURL: 'https://api.openai.com/v1',
    model: 'dall-e-3', // Default example model
    prompt: 'sunset between the mountains',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!formData.apiKey.trim()) {
      toast.error('Please enter your API key');
      return;
    }

    if (!formData.baseURL.trim()) {
      toast.error('Please enter a valid Base URL');
      return;
    }

    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Dynamically initialize the OpenAI client
    client = new OpenAI({
      baseURL: formData.baseURL,
      apiKey: formData.apiKey,
      dangerouslyAllowBrowser: true
    });

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Generate image with the OpenAI client
      const response = await client.images.generate({
        model: formData.model,
        prompt: formData.prompt,
        n: 1, // Number of images to generate
        size: '1024x1024', // Example size
      });

      // Extract the first image URL from the response
      if (response.data[0]?.url) {
        setGeneratedImage(response.data[0].url);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image URL found in the response.');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Failed to generate the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">AI Image Generator</h1>
        <p className="text-muted-foreground">
          Generate stunning images via your own custom Base URL, API key, and model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={formData.apiKey}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="baseURL">Base URL</Label>
                <Input
                  id="baseURL"
                  name="baseURL"
                  placeholder="Enter API Base URL"
                  value={formData.baseURL}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Enter model name (e.g., image-alpha-001)"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Describe the image you'd like to generate..."
                  value={formData.prompt}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card>
          <CardContent className="p-6 h-full flex justify-center items-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Generating your image...</p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-w-full rounded-lg border"
                  loading="lazy"
                />
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open(generatedImage || '', '_blank')}
                  >
                    Open Full Image
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Your generated image will appear here after submission.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGeneratorForm;
