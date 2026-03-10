import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const userService = {
    /**
     * Checks if the user is allowed to generate a new report based on their plan.
     * Throws an error if the limit is exceeded.
     */
    async checkReportGenerationLimit(userId: string): Promise<boolean> {
        const supabase = await createSupabaseServerClient();

        // 1. Check the new subscriptions table
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status, plan_name')
            .eq('user_id', userId)
            .single();

        if (subscription?.status === 'active') {
            // Pro or Researcher can generate unlimited reports
            return true;
        }

        // 2. Fallback check for legacy users table
        const { data: legacyUser } = await supabase
            .from('users')
            .select('subscription_status, plan')
            .eq('id', userId)
            .single();

        if (legacyUser?.subscription_status === 'active') {
            return true;
        }

        // 3. Free plan check
        const { count, error } = await supabase
            .from('experiments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            console.error('Error checking report usage:', error);
            throw new Error('Failed to verify usage limits');
        }

        const reportCount = count || 0;
        if (reportCount >= 3) {
            throw new Error('Free plan limit reached. Upgrade to Pro.');
        }

        return true; // Allowed as a Free user under the limit
    }
};
