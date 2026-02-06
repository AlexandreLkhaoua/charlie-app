'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ToolsPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?redirectTo=/tools');
      }
    };
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tools</h1>
      <p className="text-muted-foreground">Financial calculators and utilities</p>
    </div>
  );
}
