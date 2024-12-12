"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface PlanType {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripe_price_id: string;
}

const plans: PlanType[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: ['5 RSS feeds', 'Daily updates', 'Basic summaries'],
    stripe_price_id: ''
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    features: ['Unlimited RSS feeds', 'Real-time updates', 'Advanced summaries', 'Custom categories'],
    stripe_price_id: 'price_xxx' // Replace with actual Stripe price ID
  }
];

export default function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setCurrentPlan(data.subscription_tier);
    } catch (error) {
      toast.error('Failed to load subscription info');
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login first');

      if (planId === 'basic') {
        // Handle downgrade to basic
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_tier: 'basic' })
          .eq('id', user.id);

        if (error) throw error;
        setCurrentPlan('basic');
        toast.success('Successfully downgraded to Basic plan');
      } else {
        // Redirect to Stripe checkout
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plans.find(p => p.id === planId)?.stripe_price_id,
            userId: user.id
          })
        });

        const { sessionUrl } = await response.json();
        window.location.href = sessionUrl;
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="text-2xl font-bold">
              ${plan.price}<span className="text-sm font-normal">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={currentPlan === plan.id ? "secondary" : "default"}
              disabled={loading || currentPlan === plan.id}
              onClick={() => handleSubscribe(plan.id)}
            >
              {currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 