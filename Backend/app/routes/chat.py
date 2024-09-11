import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import google.generativeai as genai
import torch

chat_router = APIRouter()

# Configure Gemini API
# api_key = os.getenv('GEMINI_API_KEY')
# if not api_key:
#     raise HTTPException(status_code=500, detail="Gemini API key not found")

genai.configure(api_key="AIzaSyBVKJ4BPdZIswyAbFXgrMdcUJc5tovabWA")

# Gemini model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1024,
}

system_instruction = """You are a compassionate friend engaging in a supportive conversation. Respond naturally, as if chatting with someone you care about. Listen attentively and offer gentle guidance based on your wisdom and life experience. Avoid clinical language or suggesting professional help. Instead, provide a caring perspective and practical advice for navigating life's challenges. Keep your responses concise, warm, and relatable, using everyday language. Aim for messages around 2-3 sentences, never exceeding 100 words. Your goal is to be a comforting presence, helping the person feel heard and offering hope through your words and understanding."""

gemini_model = genai.GenerativeModel(
    model_name= "gemini-1.5-flash", #"gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction=system_instruction
)

class ChatInput(BaseModel):
    text: str

class ChatResponse(BaseModel):
    user_input: str
    user_classification_score: list
    model_output: str
    model_classification_score: list

def predict(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probabilities = torch.softmax(outputs.logits, dim=-1)
    return probabilities.tolist()[0]  # Probability of class 1 (suicidal content)

@chat_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_input: ChatInput, request: Request):
    user_input = chat_input.text

    # Classify user input
    user_classification_score = predict(user_input, tokenizer=request.app.state.tokenizer, model=request.app.state.model)

    # Generate model response
    chat = gemini_model.start_chat(history=request.app.state.history)
    response = chat.send_message(user_input)
    model_output = response.text



    # Classify model output
    model_classification_score = predict(model_output , tokenizer=request.app.state.tokenizer, model=request.app.state.model)

    request.app.state.history.append({"role": "user", "parts": [user_input]})
    request.app.state.history.append({"role": "model", "parts": [model_output]})

    print("\n\n chat: \n", request.app.state.history)

    return ChatResponse(
        user_input=user_input,
        user_classification_score=user_classification_score,
        model_output=model_output,
        model_classification_score=model_classification_score
    )