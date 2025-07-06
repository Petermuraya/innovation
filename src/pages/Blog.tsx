import BlogFeed from '@/components/blogs/BlogFeed';
import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Animated header section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-500 mb-4">
            Innovation Chronicles
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the latest insights, stories, and breakthroughs from our community of innovators.
          </p>
        </motion.div>

        {/* Floating decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <motion.div
            className="absolute top-20 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-1/4 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl"
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

        {/* Blog feed with subtle entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BlogFeed />
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-green-500/5 to-amber-500/5 backdrop-blur-sm border border-green-300/30 rounded-xl p-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-500 mb-3">
              Share Your Story
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Have an innovation story to tell? Contribute to our blog and inspire others.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-amber-500 hover:from-green-700 hover:to-amber-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Write for Us
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Blog;