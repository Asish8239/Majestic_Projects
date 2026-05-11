"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Chrome, Sparkles, Zap, Shield } from "lucide-react";
import { useEffect, Suspense } from "react";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-8xl mb-6 inline-block"
          >
            🎯
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Welcome to Majestic Projects
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Your AI-powered workspace for generating industry-ready projects, academic reports, and technical documentation.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">AI-Powered Generation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create projects in seconds</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">Save & Manage</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access your projects anywhere</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">100% Free</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">No credit card required</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass dark:glass-dark p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose your preferred sign-in method
          </p>

          <div className="space-y-4">
            {/* Google Sign In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-md hover:shadow-lg"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            {/* GitHub Sign In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("github", { callbackUrl })}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-600 rounded-xl font-semibold text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want to try without signing in?{" "}
              <a
                href="/generator"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Use as guest
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
