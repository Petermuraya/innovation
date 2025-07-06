import BlogFeed from '@/components/blogs/BlogFeed';
import { motion } from 'framer-motion';

const Blogs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        {/* Header with gradient text */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-amber-500 to-blue-600 mb-4"
          >
            Innovation Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover the latest insights, tutorials, and stories from our community of innovators.
          </motion.p>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-200/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Blog feed with subtle animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <BlogFeed />
        </motion.div>

        {/* CTA section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-green-500/5 to-blue-500/5 backdrop-blur-sm border border-green-300/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-3">
              Want to share your story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our community of writers and contribute to the innovation conversation.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Submit Your Blog Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Blogs;