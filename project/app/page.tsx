"use client";

import PageHeader from "@/components/PageHeader";
import ArticleForm from "@/components/ArticleForm";
import ArticleResult from "@/components/ArticleResult";
import { useState } from "react";
import { toast } from "sonner";
import type { ArticleResult as ArticleResultType } from "@/lib/api/types";
import { fetchArticleSummary } from "@/lib/api/article";
import { updateArticleResult } from "@/lib/api/article";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArticleResultType>({});

  const handleSubmit = async (url: string, type: "tldr" | "summary" | "full") => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchArticleSummary(url, type);
      setResult(prev => updateArticleResult(prev, type, data));
      toast.success(`Successfully generated ${type.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to fetch article data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-6">
        <PageHeader />
        <ArticleForm onSubmit={handleSubmit} loading={loading} />
        <ArticleResult result={result} />
      </div>
    </main>
  );
}