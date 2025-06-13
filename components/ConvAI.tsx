"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Conversation} from "@11labs/client";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(): Promise<string> {
    const response = await fetch('/api/signed-url')
    if (!response.ok) {
        throw Error('Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

export function ConvAI() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [showAddUrl, setShowAddUrl] = useState(false)
    const [showCreateText, setShowCreateText] = useState(false)
    const [url, setUrl] = useState('')
    const [textName, setTextName] = useState('')
    const [textContent, setTextContent] = useState('')

    async function startConversation() {
        const hasPermission = await requestMicrophonePermission()
        if (!hasPermission) {
            alert("No permission")
            return;
        }
        const signedUrl = await getSignedUrl()
        const conversation = await Conversation.startSession({
            signedUrl: signedUrl,
            clientTools: {
                upload_knowledge_base: async () => {
                    setShowUpload(true)
                }
            },
            onConnect: () => {
                setIsConnected(true)
                setIsSpeaking(true)
            },
            onDisconnect: () => {
                setIsConnected(false)
                setIsSpeaking(false)
            },
            onError: (error) => {
                console.log(error)
                alert('An error occurred during the conversation')
            },
            onModeChange: ({mode}) => {
                setIsSpeaking(mode === 'speaking')
            },
        })
        setConversation(conversation)
    }

    async function endConversation() {
        if (!conversation) {
            return
        }
        await conversation.endSession()
        setConversation(null)
    }

    function handleAddUrl() {
        // Handle the URL (e.g., save or upload)
        // Example: console.log(url);

        setShowAddUrl(false);   // Close the Add URL modal
        setShowUpload(false);   // Close the upload window
        setUrl('');             // (Optional) Clear the input for next time
    }

    return (
        <div className={"flex justify-center items-center gap-x-4"}>
            <Card className={'rounded-3xl'}>
                <CardContent className="flex flex-col items-center justify-center min-h-[450px]">
                    <CardHeader className="pb-0">
                        <CardTitle className={'text-center text-3xl'}>
                            {isConnected
                                ? (isSpeaking ? 'Agent is speaking' : 'Agent is listening')
                                : 'Luna'}
                        </CardTitle>
                    </CardHeader>
                    <div className="relative flex justify-center items-center my-2 mx-6">
                        <Avatar />
                        <Button
                            variant={'outline'}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-6 py-4 text-lg font-semibold shadow-lg bg-white"
                            size={"lg"}
                            onClick={conversation !== null && isConnected ? endConversation : startConversation}
                        >
                            {conversation !== null && isConnected ? 'End' : 'Start'}
                        </Button>
                    </div>
                    {showUpload && (
                        <div className="mb-4 flex flex-col items-center w-full max-w-md mx-auto bg-white rounded-xl shadow p-4">
                            <div className="flex justify-center gap-x-2 mt-2 w-full">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:bg-gray-100 transition font-light"
                                    onClick={() => setShowAddUrl(true)}
                                >
                                    <span role="img" aria-label="url">🔗</span> Add URL
                                </button>
                                <label
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white  hover:bg-gray-100 transition font-light"
                                    style={{ minWidth: 110, marginBottom: 0 }}
                                >
                                    <span role="img" aria-label="document"> 📃</span> Add Files
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={e => {
                                            // handle file upload here
                                            setShowUpload(false);
                                        }}
                                    />
                                </label>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:bg-gray-100 transition font-light"
                                    onClick={() => setShowCreateText(true)}
                                >
                                    <span role="img" aria-label="text">💬</span> Create Text
                                </button>
                            </div>
                        </div>
                    )}
                    <div className={'flex flex-col gap-y-4 text-center'}>
                    </div>
                </CardContent>
            </Card>
            {showAddUrl && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
                    onClick={() => setShowAddUrl(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-1/2 max-w-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-8">
                            <label className="block text-lg font-semibold mb-4" htmlFor="url-input">🔗 URL</label>
                            <input
                                id="url-input"
                                type="url"
                                placeholder="https://example.com"
                                className="w-full px-2 py-1 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </div>
                        <div className="w-full h-px bg-gray-200 my-4"></div>
                        <div className="flex justify-end">
                            <button
                                className="bg-black text-white px-10 py-1 rounded-full text-md font-semibold hover:bg-gray-900 transition"
                                onClick={handleAddUrl}
                            >
                                Add URL
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCreateText && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
                    onClick={() => setShowCreateText(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-8">
                            <label className="block text-lg font-semibold mb-4" htmlFor="url-input"> 💬 Create Text</label>
                        </div>
                        <div className="mb-6">
                            <label className="block text-md font-medium mb-2" htmlFor="text-name-input">Text Name</label>
                            <input
                                id="text-name-input"
                                type="text"
                                placeholder="Enter a name for your text"
                                className="w-full px-4 py-2 border-2 rounded-xl text-md focus:outline-none"
                                value={textName}
                                onChange={e => setTextName(e.target.value)}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-md font-medium mb-2" htmlFor="text-content-input">Text Content</label>
                            <textarea
                                id="text-content-input"
                                placeholder="Enter your text content here"
                                className="w-full px-4 py-2 border-2 rounded-xl text-md focus:outline-none min-h-[120px]"
                                value={textContent}
                                onChange={e => setTextContent(e.target.value)}
                            />
                        </div>
                        <div className="w-full h-px bg-gray-200 my-4"></div>
                        <div className="flex justify-end">
                            <button
                                className="bg-black text-white px-10 py-1 rounded-full text-md font-semibold hover:bg-gray-900 transition"
                                onClick={() => {
                                    // handle create text logic here
                                    setShowCreateText(false);
                                    setTextName('');
                                    setTextContent('');
                                }}
                            >
                                Create Text
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}