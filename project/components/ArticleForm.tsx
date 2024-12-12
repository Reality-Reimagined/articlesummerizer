"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { SummaryType } from "@/lib/api/types";

interface ArticleFormProps {
  onSubmit: (url: string, type: SummaryType) => Promise<void>;
  loading: boolean;
}

export default function ArticleForm({ onSubmit, loading }: ArticleFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (type: SummaryType) => {
    onSubmit(url, type);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Input
          type="url"
          placeholder="Enter article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="w-full"
        />
        
        <div className="flex flex-wrap gap-3 justify-center">
          {(["tldr", "summary", "full"] as const).map((type) => (
            <Button
              key={type}
              onClick={() => handleSubmit(type)}
              disabled={loading}
              variant="default"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get {type.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}