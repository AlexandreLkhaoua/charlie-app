'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewsPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?redirectTo=/news');
      }
    };
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Market News</h1>
      <p className="text-muted-foreground">Latest financial news and updates</p>
    </div>
  );
}
