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

const Home = () => {
    return (
        <main className="flex flex-col items-center justify-center px-4 md:px-24 py-12">
            <section className="text-center mb-8 md:mb-12">
                <h1 className="font-bold text-3xl md:text-5xl">
                    Dive into the world of Anonymous Convertation
                </h1>
                <p className="mt-3 md:mt-4 text-base md:text-lg">
                    Explore Mystery message where your identity remain secret.
                </p>
            </section>
            <Carousel className="w-full max-w-xs"
                plugins={[
                        Autoplay({
                          delay: 2000,
                        }),
                      ]}
            >
              <CarouselContent>
                  {
                      messages.map((message, index)=>(
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card>
                                  <CardHeader>
                                      {message.title}
                                  </CardHeader>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <span className="text-4xl font-semibold">{message.content}</span>
                                </CardContent>
                                <CardFooter className="flex justify-end text-gray-600">
                                    {message.recieved}
                                </CardFooter>
                              </Card>
                            </div>
                          </CarouselItem>

                      ))
                  }
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </main>
    )
}

export default Home;