import React from "react";
import ImageGeneratorForm from "@/components/ImageGeneratorForm";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-14 items-center">
          <div className="font-medium">AI Image Generator</div>
          <div className="ml-auto flex items-center space-x-4">
            <a
              href="https://platform.openai.com/docs/guides/images"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              API Docs
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-6">
        <ImageGeneratorForm />
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Made by 
              <a 
                href="https://github.com/AsaBizanjo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline hover:text-foreground ml-1"
              >
                Asa Bizanjo
              </a>
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;