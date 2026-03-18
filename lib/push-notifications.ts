"use client";

import { supabase } from '@/lib/supabase';

const VAPID_PUBLIC_KEY = 'BCdXosRHPOQ5j_E7IFZm0P7iZPl76xLSFrouFjCCt7LLST_B0oPghz0bEXDKZGYZRXxRndNfZKC-oNG3m4ASD3w';

// Base64 helper for VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications not supported');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Save subscription to database
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
                user_id: user.id,
                subscription: JSON.parse(JSON.stringify(subscription)),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) {
            console.error('Error saving subscription:', error);
        } else {
            console.log('Push notification subscription successful');
        }

    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
    }
}
