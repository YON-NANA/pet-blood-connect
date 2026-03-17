import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // メール確認コードをセッションに交換
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // profiles テーブルにドナーロールで登録（upsert で重複しても安全）
            await supabase.from('profiles').upsert({
                id: data.user.id,
                role: 'donor',
                display_name: data.user.email?.split('@')[0] ?? 'ユーザー',
            });
        }
    }

    // 登録後はドナー登録ページへリダイレクト
    return NextResponse.redirect(new URL('/register', requestUrl.origin));
}
