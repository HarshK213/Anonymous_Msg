'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";
import messages from '@/messages.json';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MessageSquare, Sparkles, Shield, ArrowRight, Users, Eye } from "lucide-react";

const Home = () => {
    const router = useRouter();
    
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 px-4 py-8 sm:py-12 md:py-16">
            {/* Hero Section */}
            <section className="mx-auto mb-10 max-w-6xl text-center sm:mb-12 md:mb-16">
                <div className="mb-6 flex justify-center sm:mb-8">
                    <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
                            <MessageSquare className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                        </div>
                        <div className="absolute -right-2 -top-2 rounded-full bg-secondary p-2">
                            <Sparkles className="h-4 w-4 text-secondary-foreground sm:h-5 sm:w-5" />
                        </div>
                    </div>
                </div>
                
                <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                    Dive Into The World Of{" "}
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Anonymous Conversations
                    </span>
                </h1>
                
                <p className="mx-auto mb-6 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
                    Where secrets are safe, identities stay hidden, and honest conversations thrive
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button 
                        onClick={() => router.replace('/send-message')}
                        className="h-12 px-8 text-base font-medium sm:h-14 sm:px-10 sm:text-lg"
                        size="lg"
                    >
                        <MessageSquare className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                        Send Anonymous Message
                        <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    
                    <Button 
                        onClick={() => router.replace('/dashboard')}
                        variant="outline"
                        className="h-12 px-8 text-base font-medium sm:h-14 sm:px-10 sm:text-lg"
                        size="lg"
                    >
                        <Users className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                        Create Your Profile
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="mx-auto mb-12 max-w-6xl sm:mb-16">
                <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
                    Why Choose Anonymous Messaging?
                </h2>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">100% Anonymous</h3>
                        <p className="text-gray-600">
                            Your identity stays completely hidden. No personal information is ever shared with recipients.
                        </p>
                    </div>
                    
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">Honest Feedback</h3>
                        <p className="text-gray-600">
                            Receive genuine, unfiltered feedback without the fear of judgment or social pressure.
                        </p>
                    </div>
                    
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <Eye className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">No Tracking</h3>
                        <p className="text-gray-600">
                            We don't track, store, or monitor your conversations. Complete privacy guaranteed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="mx-auto max-w-6xl">
                <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
                    Messages From Our Community
                </h2>
                
                <div className="relative px-4 sm:px-8 md:px-12">
                    <Carousel 
                        className="w-full"
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                        opts={{
                            align: "start",
                            loop: true,
                            dragFree: true,
                        }}
                    >
                        <CarouselContent>
                            {messages.map((message, index) => (
                                <CarouselItem 
                                    key={index} 
                                    className="sm:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-2 sm:p-3">
                                        <Card className="h-full overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                                                        {message.title}
                                                    </h3>
                                                    <div className="rounded-full bg-primary/10 p-2">
                                                        <MessageSquare className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
                                                    <span className="text-center text-2xl font-medium leading-relaxed text-gray-700 sm:text-3xl">
                                                        "{message.content}"
                                                    </span>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex items-center justify-between border-t border-gray-100 pt-3">
                                                <span className="text-sm text-gray-500 sm:text-base">
                                                    {message.recieved}
                                                </span>
                                                <div className="text-xs text-gray-400 sm:text-sm">
                                                    Anonymous Message
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        
                        {/* Responsive Navigation Buttons */}
                        <div className="mt-6 flex items-center justify-center gap-4 sm:mt-8">
                            <CarouselPrevious className="static h-10 w-10 sm:h-12 sm:w-12 lg:absolute lg:-left-12 lg:top-1/2 lg:-translate-y-1/2" />
                            <CarouselNext className="static h-10 w-10 sm:h-12 sm:w-12 lg:absolute lg:-right-12 lg:top-1/2 lg:-translate-y-1/2" />
                        </div>
                    </Carousel>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto mt-12 max-w-4xl rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 text-center sm:mt-16 sm:p-12">
                <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                    Ready to Start Your Anonymous Journey?
                </h2>
                <p className="mb-8 text-lg text-white/90 sm:text-xl">
                    Join thousands who value privacy and honest conversations
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button
                        onClick={() => router.replace('/send-message')}
                        className="h-12 bg-white text-primary hover:bg-white/90 sm:h-14 sm:px-10"
                        size="lg"
                    >
                        <MessageSquare className="mr-3 h-5 w-5" />
                        Send Your First Message
                    </Button>
                    <Button
                        onClick={() => router.replace('/dashboard')}
                        variant="outline"
                        className="h-12 border-white text-white hover:bg-white/10 sm:h-14 sm:px-10"
                        size="lg"
                    >
                        <Users className="mr-3 h-5 w-5" />
                        Create Profile
                    </Button>
                </div>
            </section>

            {/* Stats Section */}
            <section className="mx-auto mt-12 max-w-6xl sm:mt-16">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">10K+</div>
                        <div className="mt-2 text-sm text-gray-600 sm:text-base">Messages Sent</div>
                    </div>
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">5K+</div>
                        <div className="mt-2 text-sm text-gray-600 sm:text-base">Active Users</div>
                    </div>
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">100%</div>
                        <div className="mt-2 text-sm text-gray-600 sm:text-base">Anonymous</div>
                    </div>
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">24/7</div>
                        <div className="mt-2 text-sm text-gray-600 sm:text-base">Available</div>
                    </div>
                </div>
            </section>

            {/* Mobile Bottom Spacing */}
            <div className="h-8 sm:h-12"></div>
        </main>
    )
}

export default Home;