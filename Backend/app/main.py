from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change this to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get('/inits')
def inits():
    return {"project": "suicidal content detection"}


@app.on_event("startup")
async def startup_even():
    app.state.model = AutoModelForSequenceClassification.from_pretrained("Prashant-karwasra/Bert-suicidal-content-detection")
    app.state.tokenizer = AutoTokenizer.from_pretrained("Prashant-karwasra/Bert-suicidal-content-detection")

    app.state.history=[]

    app.state.my_variable = "This is initialized at startup!"
    app.state.ready_to_serve = False

    print("Loading Model.........")


    some_dummy_obj = {"dummy"}
    app.state.some_dummy_obj = some_dummy_obj

    print("Using dummy function from util")
    # dummy_util("Dummy Input")


    print("Done loading model.......")
    # Set ready to serve
    app.state.ready_to_serve = True
    print("Server startup complete.....!!!")


def create_app():
    # from .routes.home import home_router
    from .routes.model_inference import model_inference_router
    from .routes.chat import chat_router

    # app.include_router(home_router)
    app.include_router(model_inference_router)
    app.include_router(chat_router)
    return app


# app = create_app()

# Mount the React build folder
app.mount("/static", StaticFiles(directory="app/build/static"), name="static")

# Serve index.html for all other routes
@app.get("/{full_path:path}")
async def serve_react(request: Request):
    return FileResponse("app/build/index.html")

# Optionally, you can add a specific route for the root path
@app.get("/")
async def read_root():
    return FileResponse("app/build/index.html")