"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { convertToBase64 } from "@/utils/convertToBase64";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Clock, Copy } from "lucide-react";
import { MdHistory } from "react-icons/md";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Pluggable } from "unified";

const contentTypes = [
  {
    value: "twitter",
    label: "Twitter",
    icon: (
      <FaTwitter className="ml-2 mr-2 h-4 w-4 text-blue-400 group-hover:text-white group-focus:text-white" />
    ),
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: (
      <FaInstagram className="ml-2 mr-2 h-4 w-4 text-pink-400 group-hover:text-white group-focus:text-white" />
    ),
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: (
      <FaLinkedin className="ml-2 mr-2 h-4 w-4 text-blue-600 group-hover:text-white group-focus:text-white" />
    ),
  },
];

const POINTS_PER_GENERATION = 5;
const MAX_TWEET_LENGTH = 280;

interface BaseItem {
  id: string;
  prompt: string;
  contentType: string;
  imageData: string | null;
  createdAt: Date;
}

interface HistoryItem extends BaseItem {
  content: string;
}

interface SelectedItem extends BaseItem {
  content: string[];
}

const DashboardPage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [contentType, setContentType] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [content, setContent] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<SelectedItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (isSignedIn && user) {
      fetchUserPoints();
      fetchContentHistory();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`/api/user/points?userId=${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        setUserPoints(data.points);
      } else {
        console.error("Failed to fetch points:", data.error);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const fetchContentHistory = async () => {
    try {
      const response = await fetch(
        `/api/user/generation-history?userId=${user?.id}`,
      );
      const data = await response.json();
      console.log(data);
      setHistory(data.history);
    } catch (error) {
      console.error("Error fetching content history:", error);
    }
  };

  const handleImageUpload = async (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = evt.target.files?.[0];

    if (file) {
      setImage(file);
      const base64Data = await convertToBase64(file);
      setImageBase64(base64Data);
    }
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    if (value !== "instagram") {
      setImage(null);
      setImageBase64(null);
    }
  };

  const handleGenerateContent = async () => {
    setSelectedHistoryItem(null);
    setContent([]);
    setIsLoading(true);

    try {
      if (contentType === "instagram" && !imageBase64) {
        throw new Error("Image is required for Instagram content");
      }

      if (
        !user?.id ||
        userPoints === null ||
        userPoints < POINTS_PER_GENERATION
      ) {
        throw new Error("Insufficient points or user not authenticated");
      }

      const contentResponse = await fetch("/api/chat-completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          contentType,
          imageData: imageBase64,
        }),
      });

      if (!contentResponse.ok) {
        throw new Error(`HTTP error! status: ${contentResponse.status}`);
      }

      const contentData = await contentResponse.json();
      let rawGeneratedContent = contentData.choices[0].message.content;
      let generatedContent: string[] = [];

      // Spilt into separate tweets for Twitter
      if (contentType === "twitter") {
        generatedContent = rawGeneratedContent
          .split("\n\n")
          .filter((tweet: string) => tweet.trim() !== "");
      } else {
        generatedContent = [rawGeneratedContent];
      }
      setContent(generatedContent);

      // Update user points
      const updateUserPointsResponse = await fetch("/api/user/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          points: -POINTS_PER_GENERATION,
        }),
      });

      if (updateUserPointsResponse.ok) {
        const { user: updatedUser } = await updateUserPointsResponse.json();
        if (updatedUser) {
          setUserPoints(updatedUser.points);
        }
      }

      // Save the content to the database
      const savedContentResponse = await fetch("/api/user/generation-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          content: generatedContent,
          prompt,
          contentType,
          imageData: imageBase64,
        }),
      });

      if (savedContentResponse.ok) {
        const { savedContent } = await savedContentResponse.json();
        setHistory((prevHistory) => [
          {
            id: savedContent.id,
            content: savedContent.content,
            prompt: savedContent.prompt,
            contentType: savedContent.contentType,
            imageData: savedContent.imageData,
            createdAt: new Date(savedContent.createdAt),
          },
          ...prevHistory,
        ]);
      } else {
        console.error("Failed to save content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setContentType(item.contentType);
    setPrompt(item.prompt);
    setImageBase64(item.imageData);

    // Parse the content based on content type
    const parsedContent =
      item.contentType === "twitter"
        ? item.content.split("\n\n")
        : [item.content];

    setContent(parsedContent);
    setSelectedHistoryItem({
      ...item,
      content: parsedContent,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 pt-0 text-gray-100">
      <Navbar />
      <main className="container relative mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8">
        <div className="mt-28 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* History Section - Make it fixed */}
          <div className="fixed top-28 hidden w-[380px] lg:col-span-1 lg:block">
            <div className="scrollbar-modern h-[calc(100vh-12rem)] overflow-y-auto rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  History
                </h2>
                <MdHistory className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer rounded-md bg-gray-700 p-4 shadow-md transition-colors hover:bg-gray-600"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    <div className="mb-2 flex items-center">
                      {item.contentType === "twitter" && (
                        <FaTwitter className="mr-2 h-5 w-5 text-blue-400" />
                      )}
                      {item.contentType === "instagram" && (
                        <FaInstagram className="mr-2 h-5 w-5 text-pink-400" />
                      )}
                      {item.contentType === "linkedin" && (
                        <FaLinkedin className="mr-2 h-5 w-5 text-blue-600" />
                      )}
                      <span className="text-sm font-medium">
                        {item.contentType.charAt(0).toUpperCase() +
                          item.contentType.slice(1)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-gray-300">
                      {item.prompt}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gray-400">
                      <Clock className="mr-2 h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section - Allow scrolling */}
          <div className="space-y-6 pb-20 md:space-y-8 lg:col-span-2 lg:col-start-2">
            {/* Points Display Section */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg md:flex-row md:items-center md:px-8">
              <div className="flex items-center">
                <FaCoins className="mr-6 h-8 w-8 text-white" />
                <div className="flex flex-col md:gap-2">
                  <p className="text-sm text-gray-300">Available Points</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {userPoints === null ? "0" : userPoints}
                  </p>
                </div>
              </div>
              <Button className="w-full rounded-lg bg-blue-700 px-8 py-2 text-sm text-white transition-colors hover:bg-blue-600 md:w-auto">
                <Link href="/pricing">Get More Points</Link>
              </Button>
            </div>

            {/* Content Generator Section */}
            <div className="space-y-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  Content Generator
                </h2>
                <IoDocuments className="h-6 w-6 text-white" />
              </div>
              {/* Content Type Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300 md:mb-4">
                  Content Type
                </label>
                <Select
                  onValueChange={handleContentTypeChange}
                  disabled={isLoading}
                  value={contentType}
                >
                  <SelectTrigger
                    className={`w-full rounded-md border-none bg-gray-700/80 shadow-md ring-offset-0 focus:ring-2 focus:ring-blue-700 focus:ring-offset-0 ${
                      !contentType ? "text-gray-400" : "text-white"
                    }`}
                  >
                    <SelectValue placeholder="Select Content Type" />
                  </SelectTrigger>
                  <SelectContent className="border-none bg-gray-900 text-white">
                    {contentTypes.map((contentType) => (
                      <SelectItem
                        key={contentType.value}
                        value={contentType.value}
                        className="group cursor-pointer text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
                      >
                        <div className="flex items-center">
                          {contentType.icon}
                          {contentType.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Prompt Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300 md:mb-4">
                  Prompt
                </label>
                <Textarea
                  id="prompt"
                  rows={4}
                  className="w-full rounded-md border-none bg-gray-700/80 shadow-md placeholder:text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-0"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {/* Image Upload */}
              {contentType === "instagram" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300 md:mb-4">
                    Image
                  </label>
                  <div className="flex flex-col items-center md:flex-row">
                    <Input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex cursor-pointer items-center rounded-md border-none bg-gray-700/80 px-4 py-2 shadow-md hover:bg-gray-600"
                    >
                      <MdCloudUpload className="mr-2 h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </label>
                    {image && (
                      <span className="mt-2 text-sm text-gray-400 md:ml-6 md:mt-0">
                        {image.name}
                      </span>
                    )}
                  </div>
                  {imageBase64 && (
                    <div className="mt-4 flex w-full justify-center md:justify-start">
                      <img
                        src={imageBase64}
                        alt="Uploaded Image"
                        className="h-auto w-40 rounded-md shadow-md"
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={
                  !prompt ||
                  isLoading ||
                  userPoints === null ||
                  userPoints < POINTS_PER_GENERATION
                }
                className="w-full rounded-lg bg-blue-700 px-10 py-2 text-sm text-white transition-colors hover:bg-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Generating Content ...
                  </>
                ) : (
                  <>
                    <RiAiGenerate2 className="h-6 w-6" />
                    Generate Content ({POINTS_PER_GENERATION} Points)
                  </>
                )}
              </Button>
            </div>

            {/* Generated Content Display */}
            {(selectedHistoryItem || content.length > 0) && (
              <div className="mt-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                  {selectedHistoryItem
                    ? "History Content"
                    : "Generated Content"}
                </h2>
                {contentType === "twitter" ? (
                  <div className="space-y-4">
                    {(selectedHistoryItem
                      ? selectedHistoryItem.content
                      : content
                    ).map((tweet, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl bg-gray-700 p-4"
                      >
                        <ReactMarkdown
                          className="markdown-content"
                          remarkPlugins={[remarkGfm as Pluggable]}
                          rehypePlugins={[rehypeRaw as Pluggable]}
                        >
                          {tweet}
                        </ReactMarkdown>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                          <span>
                            {tweet.length}/{MAX_TWEET_LENGTH}
                          </span>
                          <Button
                            onClick={() => copyToClipboard(tweet)}
                            className="rounded-full bg-gray-600 p-2 text-white transition-colors hover:bg-gray-500"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-700 p-4">
                    <ReactMarkdown
                      className="markdown-content"
                      remarkPlugins={[remarkGfm as Pluggable]}
                      rehypePlugins={[rehypeRaw as Pluggable]}
                    >
                      {selectedHistoryItem
                        ? selectedHistoryItem.content[0]
                        : content[0]}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Mobile History Section */}
            <div className="lg:hidden">
              <div className="scrollbar-modern h-[calc(100vh-12rem)] overflow-y-auto rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white md:text-2xl">
                    History
                  </h2>
                  <MdHistory className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-6">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="cursor-pointer rounded-md bg-gray-700 p-4 shadow-md transition-colors hover:bg-gray-600"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="mb-2 flex items-center">
                        {item.contentType === "twitter" && (
                          <FaTwitter className="mr-2 h-5 w-5 text-blue-400" />
                        )}
                        {item.contentType === "instagram" && (
                          <FaInstagram className="mr-2 h-5 w-5 text-pink-400" />
                        )}
                        {item.contentType === "linkedin" && (
                          <FaLinkedin className="mr-2 h-5 w-5 text-blue-600" />
                        )}
                        <span className="text-sm font-medium">
                          {item.contentType.charAt(0).toUpperCase() +
                            item.contentType.slice(1)}
                        </span>
                      </div>
                      <p className="truncate text-sm text-gray-300">
                        {item.prompt}
                      </p>
                      <div className="mt-4 flex items-center text-xs text-gray-400">
                        <Clock className="mr-2 h-3 w-3" />
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
