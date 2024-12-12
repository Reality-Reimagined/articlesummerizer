export default function PageHeader() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold tracking-tighter">
        Article Summarizer
      </h1>
      <p className="text-muted-foreground">
        Enter an article URL to get a TLDR, summary, or full analysis
      </p>
    </div>
  );
}