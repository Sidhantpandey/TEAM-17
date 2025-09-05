from pathlib import Path
from livekit.agents import JobContext, JobProcess, WorkerOptions, cli
from livekit.agents.job import AutoSubscribe
from livekit.agents.llm import ChatContext
from livekit.agents import Agent, AgentSession
from livekit.plugins import silero

# 100% Free alternatives - no API keys needed!
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    Settings,
)
from dotenv import load_dotenv
import os
from livekit.agents import Agent, AgentSession, AutoSubscribe, JobContext, WorkerOptions, cli, llm
import datetime
import asyncio

# Import free speech libraries
import speech_recognition as sr
import pyttsx3
import threading
import queue
import numpy as np

# Load environment variables (optional - no paid services needed)
load_dotenv()

# Configure embeddings and LLM - ALL FREE
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")  # Free
Settings.embed_model = embed_model
Settings.llm = Ollama(model="llama3.1")  # Free local model

# Set up document storage for mental health resources
THIS_DIR = Path(__file__).parent
PERSIST_DIR = THIS_DIR / "mental-health-storage"

if not PERSIST_DIR.exists():
    # Load mental health documents and create the index
    # Your docs folder should contain mental health resources, coping strategies, etc.
    documents = SimpleDirectoryReader(THIS_DIR / "mental_health_docs").load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # Load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

# Crisis resources - always available
CRISIS_RESOURCES = {
    "suicide_prevention": "988 Suicide & Crisis Lifeline: Call or text 988",
    "crisis_text": "Crisis Text Line: Text HOME to 741741",
    "emergency": "Emergency services: Call 911",
    "mental_health_america": "Mental Health America: 1-800-969-6642",
    "nami": "NAMI HelpLine: 1-800-950-6264"
}

# Crisis keywords that trigger immediate resource sharing
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end it all", "want to die", "hurt myself",
    "self harm", "cutting", "overdose", "crisis", "emergency"
]

# Free Speech-to-Text using SpeechRecognition
class FreeSTT:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Adjust for ambient noise
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
    
    async def transcribe(self, audio_data):
        """Transcribe audio using free Google Web Speech API"""
        try:
            # Convert audio to text using free service
            text = self.recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return ""
        except sr.RequestError as e:
            print(f"STT Error: {e}")
            return ""

# Free Text-to-Speech using pyttsx3
class FreeTTS:
    def __init__(self):
        self.engine = pyttsx3.init()
        
        # Configure voice settings
        voices = self.engine.getProperty('voices')
        # Try to find a female voice for more empathetic sound
        for voice in voices:
            if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                self.engine.setProperty('voice', voice.id)
                break
        
        # Set speech rate (slower for empathy)
        self.engine.setProperty('rate', 150)  # Default is usually 200
        
        # Set volume
        self.engine.setProperty('volume', 0.9)
    
    async def synthesize(self, text):
        """Convert text to speech using free pyttsx3"""
        try:
            # Run TTS in a separate thread to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._speak, text)
        except Exception as e:
            print(f"TTS Error: {e}")
    
    def _speak(self, text):
        """Internal method to handle TTS"""
        self.engine.say(text)
        self.engine.runAndWait()

@llm.function_tool
async def get_mental_health_info(query: str) -> str:
    """Get evidence-based mental health information and coping strategies"""
    try:
        query_engine = index.as_query_engine(use_async=True)
        res = await query_engine.aquery(query)
        print(f"Mental health query: {query}")
        print(f"Response: {res}")
        return str(res)
    except Exception as e:
        print(f"Error querying mental health info: {e}")
        return "I'm having trouble accessing that information right now. Would you like to talk about what's on your mind?"

@llm.function_tool
async def provide_crisis_resources() -> str:
    """Provide immediate crisis intervention resources"""
    resources = "\n".join([
        "🆘 IMMEDIATE HELP AVAILABLE:",
        "• 988 Suicide & Crisis Lifeline: Call or text 988",
        "• Crisis Text Line: Text HOME to 741741",
        "• Emergency: Call 911",
        "• You're not alone, and help is available 24/7"
    ])
    return resources

@llm.function_tool
async def suggest_coping_strategies(emotion: str) -> str:
    """Suggest evidence-based coping strategies for specific emotions or situations"""
    strategies_map = {
        "anxiety": [
            "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
            "Practice deep breathing: Breathe in for 4, hold for 4, exhale for 6",
            "Progressive muscle relaxation can help release physical tension"
        ],
        "depression": [
            "Start with small, achievable goals for today",
            "Try to get some sunlight or fresh air, even briefly",
            "Reach out to one trusted person, even if it's just a text"
        ],
        "stress": [
            "Take a 5-minute break and focus only on your breathing",
            "List three things you can control in this situation",
            "Consider if this will matter in 5 years - sometimes perspective helps"
        ],
        "anger": [
            "Try counting to 10 slowly before responding",
            "Physical activity can help release anger energy safely",
            "Journal about what's triggering the anger"
        ]
    }
    
    emotion_lower = emotion.lower()
    for key, strategies in strategies_map.items():
        if key in emotion_lower:
            return f"Here are some strategies that might help with {emotion}:\n" + "\n".join(f"• {s}" for s in strategies)
    
    # Generic coping strategies
    return "Here are some general coping strategies:\n• Deep breathing exercises\n• Going for a short walk\n• Talking to someone you trust\n• Writing down your thoughts"

@llm.function_tool
async def check_crisis_indicators(message: str) -> str:
    """Check if the user's message contains crisis indicators and respond appropriately"""
    message_lower = message.lower()
    
    for keyword in CRISIS_KEYWORDS:
        if keyword in message_lower:
            return await provide_crisis_resources()
    
    return "continue_normal_conversation"

# Custom Agent class for free speech services
class FreeVoiceAgent:
    def __init__(self):
        self.stt = FreeSTT()
        self.tts = FreeTTS()
        self.llm = Ollama(model="llama3.1")
        self.is_listening = False
        
    async def process_conversation(self):
        """Main conversation loop"""
        print("🎤 Free Voice Agent Started!")
        print("Say something... (Press Ctrl+C to stop)")
        
        # Initial greeting
        greeting = "Hello, I'm Sage. I'm here to listen and support you. How are you feeling today?"
        print(f"Sage: {greeting}")
        await self.tts.synthesize(greeting)
        
        try:
            while True:
                # Listen for user input
                print("\n🎧 Listening...")
                user_input = await self.listen_for_input()
                
                if user_input:
                    print(f"You: {user_input}")
                    
                    # Check for crisis indicators first
                    crisis_check = await check_crisis_indicators(user_input)
                    if crisis_check != "continue_normal_conversation":
                        print(f"Sage: {crisis_check}")
                        await self.tts.synthesize(crisis_check)
                        continue
                    
                    # Generate response using Ollama
                    response = await self.generate_response(user_input)
                    print(f"Sage: {response}")
                    await self.tts.synthesize(response)
                    
        except KeyboardInterrupt:
            print("\n👋 Goodbye! Take care of yourself.")
    
    async def listen_for_input(self):
        """Listen for audio input and convert to text"""
        try:
            with self.stt.microphone as source:
                # Listen for audio with timeout
                audio = self.stt.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            # Transcribe audio
            text = await self.stt.transcribe(audio)
            return text.strip()
            
        except sr.WaitTimeoutError:
            return ""
        except Exception as e:
            print(f"Listening error: {e}")
            return ""
    
    async def generate_response(self, user_input):
        """Generate empathetic response using local LLM"""
        try:
            # Create a mental health focused prompt
            prompt = f"""You are Sage, a compassionate AI mental health support assistant. 

Guidelines:
- Provide emotional support and be empathetic
- Keep responses concise (2-3 sentences) but warm
- Validate the person's feelings
- Suggest coping strategies when appropriate
- Never diagnose or replace professional therapy

User said: "{user_input}"

Respond with empathy and support:"""

            # Use Ollama to generate response
            response = await self.llm.acomplete(prompt)
            return str(response.text).strip()
            
        except Exception as e:
            print(f"LLM error: {e}")
            return "I hear you, and I want you to know that your feelings are valid. Sometimes it helps to take things one moment at a time. What's one small thing that might help you feel a little better right now?"

async def entrypoint(ctx: JobContext):
    """Entry point for the free voice agent"""
    # For this free version, we'll run a standalone conversation
    # instead of using LiveKit rooms (which may require setup)
    
    agent = FreeVoiceAgent()
    await agent.process_conversation()

# Alternative simple runner for testing
async def run_free_agent():
    """Simple way to run the agent without LiveKit setup"""
    agent = FreeVoiceAgent()
    await agent.process_conversation()

if __name__ == "__main__":
    # Two ways to run:
    
    # Option 1: With LiveKit (if you have it set up)
    # cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
    
    # Option 2: Standalone mode (completely free, no setup needed)
    print("🤖 Starting Free Mental Health Voice Agent...")
    print("Make sure you have:")
    print("1. Installed Ollama and pulled llama3.1 model")
    print("2. A working microphone")
    print("3. Speakers/headphones")
    print("\nStarting in 3 seconds...\n")
    
    import time
    time.sleep(3)
    
    asyncio.run(run_free_agent())