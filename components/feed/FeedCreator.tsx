"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function FeedCreator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedPreview, setFeedPreview] = useState<any>(null);

  const validateFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/validate-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFeedPreview(data);
      toast.success('Feed validated successfully');
    } catch (error) {
      toast.error('Invalid RSS feed URL');
      setFeedPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const saveFeed = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login first');

      const { error } = await supabase.from('feeds').insert({
        url,
        title: feedPreview.title,
        description: feedPreview.description,
        user_id: user.id,
        is_active: true
      });

      if (error) throw error;

      toast.success('Feed added successfully');
      window.location.href = '/feeds';
    } catch (error) {
      toast.error('Failed to save feed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New RSS Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">RSS Feed URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://example.com/feed.xml"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button onClick={validateFeed} disabled={loading || !url}>
                Validate
              </Button>
            </div>
          </div>

          {feedPreview && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">{feedPreview.title}</h3>
                <p className="text-sm text-muted-foreground">{feedPreview.description}</p>
              </div>
              <Button onClick={saveFeed} disabled={loading} className="w-full">
                Add Feed
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 