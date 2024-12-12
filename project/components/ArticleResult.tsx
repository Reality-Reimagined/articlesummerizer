"use client";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ArticleResult } from "@/lib/api/types";

interface ResultProps {
  result: ArticleResult;
}

export default function ArticleResult({ result }: ResultProps) {
  if (!result.tldr && !result.summary && !result.fullText) {
    return null;
  }

  const sections = [
    { key: "tldr", title: "TLDR", content: result.tldr },
    { key: "summary", title: "Summary", content: result.summary },
    { key: "full", title: "Full Analysis", content: result.fullText }
  ];

  return (
    <Card className="p-6">
      <Accordion type="single" collapsible className="w-full">
        {sections.map(({ key, title, content }) => 
          content && (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-xl font-semibold">
                {title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                {content}
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </Card>
  );
}