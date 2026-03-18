import { NextResponse } from 'next/server';
import webPush from 'web-push';

const VAPID_PUBLIC_KEY = 'BCdXosRHPOQ5j_E7IFZm0P7iZPl76xLSFrouFjCCt7LLST_B0oPghz0bEXDKZGYZRXxRndNfZKC-oNG3m4ASD3w';
const VAPID_PRIVATE_KEY = 'CeKZB-G7Xh_QtDVzyeJohzRCFshvTFc8ojGJe7FBM2E';

webPush.setVapidDetails(
  'mailto:animalbloodconnect@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: Request) {
  try {
    const { subscriptions, title, body, url } = await req.json();

    const notifications = subscriptions.map((sub: webPush.PushSubscription) => {
      return webPush.sendNotification(
        sub,
        JSON.stringify({ title, body, url })
      ).catch((err: unknown) => {
        console.error('Error sending notification:', err);
        // handle expired subscriptions if needed
      });
    });

    await Promise.all(notifications);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
