"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Feed } from "@/lib/supabase/types";

export default function FeedManager() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeeds(data || []);
    } catch (error) {
      toast.error('Failed to load feeds');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeedStatus = async (feedId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('feeds')
        .update({ is_active: !isActive })
        .eq('id', feedId);

      if (error) throw error;
      
      setFeeds(feeds.map(feed => 
        feed.id === feedId ? { ...feed, is_active: !isActive } : feed
      ));
      
      toast.success('Feed status updated');
    } catch (error) {
      toast.error('Failed to update feed status');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>My Feeds</span>
            <Button variant="outline" onClick={() => window.location.href = '/feeds/new'}>
              Add New Feed
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading feeds...</div>
          ) : feeds.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No feeds added yet. Add your first feed to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {feeds.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{feed.title}</h3>
                    <p className="text-sm text-muted-foreground">{feed.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={feed.is_active ? "default" : "secondary"}
                      onClick={() => toggleFeedStatus(feed.id, feed.is_active)}
                    >
                      {feed.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 