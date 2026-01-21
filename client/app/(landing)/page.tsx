import Header from "../_components/landing/header";
import Hero from "../_components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}