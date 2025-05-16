
// src/app/about-us/page.tsx
"use client"; // Ensure client component if using hooks or event handlers, otherwise can be server

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Users, Target, Lightbulb, Zap, ShieldCheck } from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="shadow-xl overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full">
            <Image 
              src="https://placehold.co/1200x400.png" 
              alt="MarketMate community or concept art" 
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              data-ai-hint="community marketplace team"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">About MarketMate</h1>
              <p className="text-lg text-primary-foreground/90 mt-2">
                Connecting buyers and sellers in a vibrant, community-focused marketplace.
              </p>
            </div>
          </div>
          <CardContent className="p-6 sm:p-10 space-y-8 text-base text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><Users className="mr-3 h-7 w-7" /> Our Story</h2>
              <p className="mb-3 leading-relaxed">
                MarketMate was born from a simple idea: to create a trusted, efficient, and enjoyable platform for people to buy and sell pre-loved goods. We believe in the power of community and the importance of sustainability. By giving items a second life, we help users discover great value and contribute to a more circular economy.
              </p>
              <p className="leading-relaxed">
                Our journey began with a small, passionate team dedicated to blending technology with local commerce. We envisioned more than just a marketplace; we aimed to build a connected community where transactions are smooth, safe, and satisfying.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><Target className="mr-3 h-7 w-7" /> Our Mission</h2>
              <p className="mb-3 leading-relaxed">
                Our mission is to empower individuals by providing a seamless and secure experience for trading used products. We are committed to:
              </p>
              <ul className="list-none space-y-3 pl-2">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                  <span>Fostering a <span className="font-semibold">trustworthy and transparent</span> environment for all users through clear guidelines and (future) verification features.</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                  <span>Making buying and selling <span className="font-semibold">simple, intuitive, and accessible</span> to everyone, regardless of technical skill.</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                  <span>Promoting <span className="font-semibold">sustainability and responsible consumption</span> by encouraging the reuse and recirculation of items.</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                  <span>Leveraging innovative technology, including <span className="font-semibold">AI-powered assistance</span>, to enhance user experience and discovery.</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><Lightbulb className="mr-3 h-7 w-7" /> Why Choose MarketMate?</h2>
              <p className="mb-3 leading-relaxed">
                We're dedicated to building the best possible platform for used goods. With features like AI-driven tag suggestions, intelligent search capabilities, comprehensive filtering options, and a clean, user-friendly interface, MarketMate makes it easier than ever to discover hidden gems or find new homes for your items.
              </p>
              <p className="leading-relaxed">
                Our commitment extends to continuous improvement, listening to our community, and adapting to the evolving needs of buyers and sellers. Join our growing family and experience a smarter, safer, and more rewarding way to participate in the circular economy!
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
