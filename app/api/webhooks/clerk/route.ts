import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Allowed Ngrok URL
const ALLOWED_WEBHOOK_URLS = [
  'https://5bc0-2a02-ed1-11-219c-b815-f4f7-9130-9df.ngrok-free.app/api/webhooks/clerk',
  'http://localhost:3000/api/webhooks/clerk'
];

export const POST = async (req: NextRequest) => {
  // Comprehensive Environment Logging
  console.log('🔍 ENVIRONMENT DIAGNOSTIC:', {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    SIGNING_SECRET: !!process.env.SIGNING_SECRET,
    CLERK_WEBHOOK_SECRET: !!process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CONVEX_URL: !!process.env.NEXT_PUBLIC_CONVEX_URL,
    CONVEX_DEPLOYMENT: !!process.env.CONVEX_DEPLOYMENT,
  });

  // Validate webhook secret is set
  const webhookSecret = process.env.SIGNING_SECRET || process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ CLERK WEBHOOK: Webhook secret is not set');
    return NextResponse.json({ success: false, message: 'Webhook secret not configured' }, { status: 500 });
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
    return NextResponse.json({ success: false, message: 'Invalid webhook URL' }, { status: 403 });
  }

  const svixId = (await headerPayload).get('svix-id') ?? '';
  const svixTimestamp = (await headerPayload).get('svix-timestamp') ?? '';
  const svixSignature = (await headerPayload).get('svix-signature') ?? '';

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('❌ CLERK WEBHOOK: Missing webhook headers', { svixId, svixTimestamp, svixSignature });
    return NextResponse.json({ success: false, message: 'Error: Missing webhook headers' }, { status: 400 });
  }

  // Get the body
  const body = await req.json();
  console.log('📦 Raw Webhook Body:', body);

  // Create a new Svix instance with your webhook secrets
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
    return NextResponse.json({ success: false, message: 'Error verifying webhook' }, { status: 400 });
  }

  // Handle the webhook event
  try {
    switch (evt.type) {
      case 'user.created':
        // Handle user creation
        break;
      case 'user.updated':
        // Handle user update
        break;
      default:
        console.log(`❓ CLERK WEBHOOK: Unhandled event type ${evt.type}`);
        return NextResponse.json({ success: false, message: 'Unhandled event type' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ CLERK WEBHOOK: Processing Error', error);
    return NextResponse.json({ success: false, message: 'Error processing webhook' }, { status: 500 });
  }

  // Ensure to return a default response if all cases are handled
  return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
};