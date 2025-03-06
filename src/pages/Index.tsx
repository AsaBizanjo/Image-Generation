
import React from "react";
import ImageGeneratorForm from "@/components/ImageGeneratorForm";

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
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AI Image Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
