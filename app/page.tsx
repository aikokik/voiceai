import {ConvAI} from "@/components/ConvAI";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">
                        Платформа голосового агента
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Давайте пообщаемся, чтобы создать вашего полезного разговорного агента нажмите «Начать» и разрешите доступ к микрофону.
                    </p>
                </div>
                <ConvAI/>
            </main>
        </div>
    );
}
