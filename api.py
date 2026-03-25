from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import trending_fetcher as backend_main_file

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/fetch-topic")
def fetch_topic():
    news = backend_main_file.get_top_indian_news()
    return {"topics": news}

@app.post("/api/generate-script")
def generate_script(title: str = Form(...), description: str = Form(...)):
    script = backend_main_file.generate_single_script({"title": title, "description": description})
    return {"script": script}

@app.post("/api/upload-avatar")
def upload_avatar(file: UploadFile = File(...)):
    with open("avatar.mp4", "wb") as f:
        f.write(file.file.read())
    return {"status": "uploaded"}

@app.post("/api/generate-voiceover")
def generate_voiceover(script: str = Form(...)):
    out_path = "output/temp_voice.wav"
    backend_main_file.generate_voiceover_local(script, out_path)
    return {"audio": out_path}

@app.post("/api/generate-video")
def generate_video(audio_path: str = Form(...)):
    out_path = "output/final_video.mp4"
    backend_main_file.generate_avatar_video_local(audio_path, out_path)
    return {"video": out_path}

@app.get("/api/saved-videos")
def list_saved_videos():
    files = [f for f in os.listdir("output") if f.endswith(".mp4")]
    # Optionally add more metadata (date, etc.)
    videos = []
    for f in files:
        stat = os.stat(os.path.join("output", f))
        videos.append({
            "file": f,
            "title": f,
            "date": stat.st_mtime,
            "size": stat.st_size
        })
    return {"videos": videos}

@app.get("/api/download-video")
def download_video(file: str):
    return FileResponse(f"output/{file}") 