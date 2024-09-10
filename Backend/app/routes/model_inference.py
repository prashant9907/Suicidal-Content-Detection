from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
from typing import List

model_inference_router = APIRouter()

class DataRequest(BaseModel):
    fields: str 

class DataResponse(BaseModel) :
    message : str 
    Status_Code: int



@model_inference_router.post('/see_some_dummy_obj', response_model = DataResponse)
async def predict_docKV(request: Request, data_request: DataRequest):
    print("Now running: see_some_dummy_obj")

    print("The dummy obj is: ", str(request.app.state.some_dummy_obj))

    print("Field: ", data_request.fields)

    return DataResponse(
        message = "Processed Succesfully",
        Status_Code = 200,
    )


@model_inference_router.post('/detect')
async def predict(request: Request):
    form_data = await request.form()
    text = form_data.get("text")

    if not text:
        raise HTTPException(status_code=400, detail="Text field is required")

    # Tokenize the input text
    inputs = request.app.state.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    
    # Forward pass through the model to get logits
    with torch.no_grad():
        outputs = request.app.state.model(**inputs)
    
    # Get the predicted class (assuming binary classification)
    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=-1).tolist()[0]
    predicted_class = torch.argmax(logits, dim=-1).item()

    if predicted_class == 0:
        prediction = 'Suicidal Content'
    else:
        prediction = 'Non Suicidal Content'

    output = {
        "predicted_class": prediction,
        "probabilities": probabilities
    }

    return output