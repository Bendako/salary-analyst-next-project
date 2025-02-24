import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { api } from '@/convex/_generated/api';
import { httpAction } from '@/convex/_generated/server';

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Allowed Ngrok URL
const ALLOWED_WEBHOOK_URLS = [
  'https://5bc0-2a02-ed1-11-219c-b815-f4f7-9130-9df.ngrok-free.app/api/webhooks/clerk',
  'http://localhost:3000/api/webhooks/clerk'
];

export const POST = httpAction(async (ctx, req) => {
  // Comprehensive Environment Logging
  console.log('🔍 ENVIRONMENT DIAGNOSTIC:', {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    SIGNING_SECRET: !!process.env.SIGNING_SECRET,
    CLERK_WEBHOOK_SECRET: !!process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CONVEX_URL: !!process.env.NEXT_PUBLIC_CONVEX_URL,
    CONVEX_DEPLOYMENT: !!process.env.CONVEX_DEPLOYMENT,
  });

  console.log('🔔 CLERK WEBHOOK: Starting processing');

  // Validate webhook secret is set
  const webhookSecret = process.env.SIGNING_SECRET || process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ CLERK WEBHOOK: Webhook secret is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Log raw request details
  const headerPayload = headers();
  const requestUrl = (await headerPayload).get('x-forwarded-host') || 'unknown';
  
  console.log('🔍 Webhook Request Details:', {
    'svix-id': (await headerPayload).get('svix-id'),
    'svix-timestamp': (await headerPayload).get('svix-timestamp'),
    'svix-signature': (await headerPayload).get('svix-signature'),
    'request-url': requestUrl,
  });

  // Validate webhook URL
  if (!ALLOWED_WEBHOOK_URLS.includes(requestUrl)) {
    console.error('❌ CLERK WEBHOOK: Invalid webhook URL', { requestUrl });
    return new Response('Invalid webhook URL', { status: 403 });
  }

  const svixId = (await headerPayload).get('svix-id') ?? '';
  const svixTimestamp = (await headerPayload).get('svix-timestamp') ?? '';
  const svixSignature = (await headerPayload).get('svix-signature') ?? '';

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('❌ CLERK WEBHOOK: Missing webhook headers', { 
      svixId, 
      svixTimestamp, 
      svixSignature 
    });
    return new Response('Error: Missing webhook headers', { status: 400 });
  }

  // Get the body
  const body = await req.text();
  console.log('📦 Raw Webhook Body:', body);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
    console.log('✅ CLERK WEBHOOK: Verified successfully');
  } catch (err) {
    console.error('❌ CLERK WEBHOOK: Verification failed', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Handle the webhook event
  try {
    switch (evt.type) {
      case 'user.created':
        try {
          const userCreated = evt.data as { 
            email_addresses: { email_address: string }[], 
            first_name: string, 
            last_name: string, 
            image_url: string, 
            id: string 
          };
          
          // Validate user data before mutation
          if (!userCreated.email_addresses || userCreated.email_addresses.length === 0) {
            console.error('❌ CLERK WEBHOOK: No email addresses found', { userCreated });
            break;
          }

          const email = userCreated.email_addresses[0]?.email_address;
          const name = `${userCreated.first_name || ''} ${userCreated.last_name || ''}`.trim();

          console.log('🆕 CLERK WEBHOOK: User Created Event', {
            fullEventData: userCreated,
            email: email,
            name: name,
            imageUrl: userCreated.image_url,
            clerkId: userCreated.id,
          });

          // Validate critical fields
          if (!email || !name || !userCreated.id) {
            console.error('❌ CLERK WEBHOOK: Missing critical user fields', {
              hasEmail: !!email,
              hasName: !!name,
              hasClerkId: !!userCreated.id
            });
            break;
          }

          try {
            const result = await ctx.runMutation(api.clerk.createClerkUser, {
              email: email,
              name: name,
              imageUrl: userCreated.image_url,
              clerkId: userCreated.id,
            });

            console.log('✨ CLERK WEBHOOK: User Creation Mutation Result', result);
          } catch (mutationError) {
            console.error('❌ CLERK WEBHOOK: User Creation Mutation Failed', {
              error: mutationError,
              userDetails: {
                email: email,
                name: name,
                clerkId: userCreated.id
              }
            });
          }
          break;
        } catch (processingError) {
          console.error('❌ CLERK WEBHOOK: User Created Event Processing Error', processingError);
        }
        break;
      case 'user.updated':
        const userUpdated = evt.data as { 
          email_addresses: { email_address: string }[], 
          first_name: string, 
          last_name: string, 
          image_url: string, 
          id: string 
        };
        
        console.log('🔄 CLERK WEBHOOK: User Updated Event', {
          fullEventData: userUpdated,
          email: userUpdated.email_addresses[0]?.email_address,
          name: `${userUpdated.first_name || ''} ${userUpdated.last_name || ''}`.trim(),
          imageUrl: userUpdated.image_url,
          clerkId: userUpdated.id,
        });

        const updateResult = await ctx.runMutation(api.clerk.createClerkUser, {
          email: userUpdated.email_addresses[0]?.email_address || '',
          name: `${userUpdated.first_name || ''} ${userUpdated.last_name || ''}`.trim(),
          imageUrl: userUpdated.image_url,
          clerkId: userUpdated.id,
        });

        console.log('✨ CLERK WEBHOOK: User Update Mutation Result', updateResult);
        break;
      default:
        console.log(`❓ CLERK WEBHOOK: Unhandled event type ${evt.type}`);
    }
  } catch (error) {
    console.error('❌ CLERK WEBHOOK: Processing Error', error);
    return new Response('Error processing webhook', { status: 500 });
  }

  return new Response('Webhook processed successfully', { status: 200 });
});
