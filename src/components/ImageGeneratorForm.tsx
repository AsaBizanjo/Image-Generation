
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  prompt: string;
  endpoint: string;
  apiKey: string;
}

const ImageGeneratorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    endpoint: "https://api.openai.com/v1/images/generations",
    apiKey: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    if (!formData.apiKey.trim()) {
      toast.error("Please enter your API key");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(formData.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${formData.apiKey}`,
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          n: 1,
          size: "1024x1024",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate image");
      }

      if (data.data && data.data[0]?.url) {
        setGeneratedImage(data.data[0].url);
        toast.success("Image generated successfully!");
      } else {
        throw new Error("No image URL in the response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2 text-center animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Create stunning images using AI. Just enter a prompt, your API endpoint, and API key.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border transition-all duration-300 animate-slide-up">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={formData.prompt}
                  onChange={handleChange}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  name="endpoint"
                  placeholder="https://api.openai.com/v1/images/generations"
                  value={formData.endpoint}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
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
              
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className={`overflow-hidden border transition-all duration-300 animate-slide-up delay-100 ${!generatedImage && !isLoading ? 'flex items-center justify-center min-h-[300px]' : ''}`}>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-10">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                </div>
                <p className="text-muted-foreground">Generating your image...</p>
              </div>
            ) : generatedImage ? (
              <div className="w-full animate-zoom-in">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="h-full w-full object-cover transition-all"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open(generatedImage, "_blank")}
                    className="transition-all duration-300"
                  >
                    View Full Size
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Your generated image will appear here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGeneratorForm;
