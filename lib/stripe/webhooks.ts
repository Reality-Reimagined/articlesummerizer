// import Stripe from 'stripe';
// import { supabase } from '@/lib/supabase/client';
// import { SUBSCRIPTION_STATUS } from './config';

// export async function handleStripeWebhook(
//   event: Stripe.Event
// ): Promise<{ success: boolean; message?: string }> {
//   try {
//     switch (event.type) {
//       case 'customer.subscription.created':
//       case 'customer.subscription.updated': {
//         const subscription = event.data.object as Stripe.Subscription;
//         const userId = subscription.metadata.userId;
        
//         if (!userId) {
//           throw new Error('No userId in subscription metadata');
//         }

//         const status = subscription.status;
//         const priceId = subscription.items.data[0].price.id;
        
//         // Update user profile with new subscription details
//         const { error } = await supabase
//           .from('user_profiles')
//           .update({
//             subscription_tier: priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ? 'pro' : 'enterprise',
//             subscription_status: status,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', userId);

//         if (error) throw error;
//         break;
//       }

//       case 'customer.subscription.deleted': {
//         const subscription = event.data.object as Stripe.Subscription;
//         const userId = subscription.metadata.userId;

//         if (!userId) {
//           throw new Error('No userId in subscription metadata');
//         }

//         // Reset user to free tier
//         const { error } = await supabase
//           .from('user_profiles')
//           .update({
//             subscription_tier: 'free',
//             subscription_status: SUBSCRIPTION_STATUS.canceled,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', userId);

//         if (error) throw error;
//         break;
//       }
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Error handling webhook:', error);
//     return { 
//       success: false, 
//       message: error instanceof Error ? error.message : 'Unknown error' 
//     };
//   }
// }