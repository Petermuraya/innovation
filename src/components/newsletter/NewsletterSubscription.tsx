import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Loader2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
} from '@/components/ui';

const NewsletterSubscription = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .upsert(
          {
            email: email.trim(),
            user_id: user?.id || null,
            status: 'active',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'email' }
        );

      if (error) throw error;
      
      toast.success('You are now subscribed!', {
        description: 'Look forward to our latest updates in your inbox.',
        position: 'top-center',
      });
      setSubscribed(true);
      if (!user) setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Subscription failed', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md border-none shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600">
          <CardTitle className="flex items-center gap-3 text-white">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-bold">Stay Updated</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium">You're subscribed!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you for joining our newsletter. We'll keep you updated with the latest news.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSubscribed(false)}
                >
                  Back to form
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubscribe}
                className="space-y-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get exclusive access to:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                    <span>Latest community events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                    <span>New project opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                    <span>Exclusive content and resources</span>
                  </li>
                </ul>

                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-5 px-4 rounded-lg border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsletterSubscription;