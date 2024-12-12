"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "9",
    priceId: "price_1QV32wFdrnY8S7ejWhlnS0GT",
    features: [
      "100 AI-generated posts per month",
      "Twitter thread generation",
      "Basic analytics",
    ],
    isRecommended: false,
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "29",
    priceId: "price_1QV33UFdrnY8S7ej2WEbTMe3",
    features: [
      "500 AI-generated posts",
      "Twitter, Instagram, LinkedIn content",
      "Advanced analytics",
      "Priority support",
    ],
    isRecommended: true,
    buttonText: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceId: "contact_sales",
    features: [
      "Unlimited AI-generated posts",
      "All social media platforms",
      "Custom AI model training",
      "Dedicated account manager",
    ],
    isRecommended: false,
    buttonText: "Contact Sales",
  },
];

type Subscription = {
  plan: string;
  status: string;
};

const PricingPage = () => {
  const { isSignedIn, user } = useUser();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/subscriptions/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Subscription data:", data.subscription);
          setCurrentSubscription(data.subscription);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const handleSubscription = async (priceId: string) => {
    if (!isSignedIn || !user) {
      return;
    }

    setLoadingPriceId(priceId);

    try {
      if (priceId === "contact_sales") {
        // TODO: Redirect to contact sales page
        console.log("TODO: Redirect to contact sales page");
      } else {
        // Create checkout session
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to create checkout session",
          );
        }

        const { sessionId } = await response.json();
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        );

        if (!stripe) {
          throw new Error("Stripe could not be loaded");
        }
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (err) {
      console.error("Error: Failed to create checkout session:", err);
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 pt-0 text-gray-100">
      <Navbar />
      <main className="container relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-4xl font-semibold sm:mb-20">
          Pricing Plans
        </h1>
        <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`flex h-full flex-col justify-between rounded-xl bg-gray-800/50 p-8 shadow-md transition-all duration-300 hover:translate-y-[-5px] ${plan.isRecommended ? "border-2 border-blue-500" : ""}`}
            >
              <h2 className="mb-6 text-xl font-semibold text-white">
                {plan.name}
              </h2>
              <p className="mb-6 text-4xl font-bold text-white">
                ${plan.price}
                <span className="text-lg font-normal text-gray-400">
                  {" "}
                  /month
                </span>
              </p>
              <ul className="mb-12 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <FaCheckCircle className="mr-2 size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscription(plan.priceId || "")}
                disabled={loadingPriceId !== null || !isSignedIn}
                className={`mt-auto w-full py-5 shadow-lg ${
                  plan.isRecommended
                    ? "bg-blue-700 hover:bg-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {loadingPriceId === plan.priceId ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : currentSubscription?.plan?.toLowerCase() ===
                  plan.name.toLowerCase() ? (
                  "Current Plan"
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
