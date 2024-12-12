"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import {
  SparklesIcon,
  ZapIcon,
  TrendingUpIcon,
  RocketIcon,
  BadgeCheckIcon,
  ArrowRightIcon,
} from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const featureItems = [
  {
    title: "Twitter Threads",
    icon: <FaTwitter className="mb-4 h-10 w-10 text-blue-400" />,
    description:
      "Generate compelling Twitter threads that engage your audience and boost your reach.",
  },
  {
    title: "Instagram Captions",
    icon: <FaInstagram className="mb-4 h-10 w-10 text-pink-400" />,
    description:
      "Create catchy captions for your Instagram posts that increase engagement and followers.",
  },
  {
    title: "LinkedIn Posts",
    icon: <FaLinkedin className="mb-4 h-10 w-10 text-blue-600" />,
    description:
      "Craft professional content for your LinkedIn network to establish thought leadership.",
  },
];

const benefits = [
  "Save time and effort on content creation",
  "Consistently produce high-quality posts",
  "Increase engagement across all platforms",
  "Stay ahead of social media trends",
  "Customize content to match your brand voice",
  "Scale your social media presence effortlessly",
];

export default function HomePage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 pt-0 text-gray-100">
      <Navbar />
      <main className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="animate-float absolute left-10 top-40 sm:left-20">
          <SparklesIcon className="glow-yellow h-8 w-8 text-yellow-400 opacity-80" />
        </div>
        <div className="animate-float animation-delay-2000 absolute right-10 top-60 sm:right-20">
          <ZapIcon className="glow-blue h-8 w-8 text-blue-400 opacity-80" />
        </div>
        <div className="animate-float animation-delay-4000 absolute bottom-20 left-1/4">
          <TrendingUpIcon className="glow-green h-12 w-12 text-green-400 opacity-80" />
        </div>

        {/* Hero Section */}
        <div className="flex h-screen flex-col items-center justify-center">
          <RocketIcon className="mx-auto mb-6 size-14 animate-bounce text-purple-500 sm:size-16" />
          <h1 className="flex flex-col gap-2 text-center text-4xl font-bold sm:gap-4 sm:text-6xl">
            <span className="glow-yellow group relative text-yellow-500">
              AI-Powered
            </span>
            <span>Social Media Content Generator</span>
          </h1>
          <p className="px-auto mt-6 text-center text-lg text-gray-500 sm:text-xl lg:mt-8 lg:px-40">
            Generate engaging content for your social media platforms with our
            AI-powered tool.
            <span className="hidden sm:inline">
              This tool is designed to help you create content for your
              Instagram, LinkedIn, and Twitter.
            </span>
          </p>
          <div className="mt-12 flex flex-row justify-center space-x-4 lg:space-x-8">
            <Button
              size="lg"
              className="asChild transform bg-blue-700 px-8 py-4 text-base text-white transition-colors duration-300 hover:bg-blue-600"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button
              size="lg"
              className="asChild border-none bg-gray-800 px-8 py-4 text-base text-white transition-colors duration-300 hover:bg-gray-700"
            >
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div
          className="flex flex-col items-center justify-center pb-16 pt-0 lg:pt-6"
          id="features"
        >
          <button className="mb-8 flex w-32 flex-row items-center justify-center gap-2 rounded-full bg-gray-600/30 py-1.5 text-sm font-semibold text-gray-300">
            <SparklesIcon className="h-3.5 w-3.5 text-yellow-400 opacity-80" />
            Features
          </button>
          <h2 className="mb-12 text-center text-3xl font-semibold text-white">
            Supercharge Your Social Media Presence
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {featureItems.map((feature, index) => (
              <div
                key={index}
                className="transform rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="mb-3 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative mx-auto my-32 max-w-5xl rounded-3xl bg-gray-900 px-6 py-12 sm:py-16">
          <h2 className="mb-12 text-center text-3xl font-semibold text-white">
            Why Choose Our AI Content Generator?
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="group flex items-center space-x-3">
                <BadgeCheckIcon className="h-6 w-6 flex-shrink-0 text-green-500 transition-colors duration-300 group-hover:text-green-400" />
                <span className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative mb-24 py-24 text-center">
          <div className="animate-spin-slow absolute right-10 top-10">
            <svg
              className="h-20 w-20 text-blue-500 opacity-20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="mb-12 text-4xl font-bold text-white">
            Ready to revolutionize your social media strategy?
          </h2>
          {userId ? (
            <Button
              asChild
              className="transform rounded-full bg-blue-600 px-10 py-4 text-base text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
            >
              <Link href="/dashboard">
                Generate Content Now <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <SignUpButton>
              <Button className="transform rounded-full bg-blue-600 px-10 py-4 text-base text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700">
                Get Started for Free
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
          )}
          <p className="mt-4 text-gray-400">No credit card required</p>
        </div>
      </main>
    </div>
  );
}
