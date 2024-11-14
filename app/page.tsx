import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">AI Interview Buddy</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6">
              <Link
                href="/features"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Master Your Interviews with
              <span className="text-primary"> AI-Powered</span> Coaching
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Practice interviews with our AI coach, get real-time feedback, and improve your skills with personalized insights.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="px-8">Get Started</Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Sparkles className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">AI-Powered Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant feedback on your responses with advanced AI analysis.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Target className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Personalized Practice</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailored questions based on your resume and target job.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Users className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Expert Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn from industry-specific interview patterns and best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Brain className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                AI Interview Buddy
              </a>
              . The source code is available on{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}