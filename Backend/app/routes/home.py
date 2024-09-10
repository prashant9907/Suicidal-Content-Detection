from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

home_router  = APIRouter()


@home_router.get('/')
def read_root(request: Request):
    print(request.app.state.my_variable)
    return {"hello world": request.app.state.my_variable}


@home_router.get('/ready')
def ready(request: Request):
    if request.app.state.ready_to_serve:
        return JSONResponse({"status": "ready"}, status_code=200)
    else:
        return JSONResponse({"status": "not ready"}, status_code = 503)
    
class Item(BaseModel):
    model_input: str

@home_router.get("/hello")
def read_hello(item: Item):
    model_input = item.model_input
    return {"Hello": f"from a different route with model_input: {model_input}"}

