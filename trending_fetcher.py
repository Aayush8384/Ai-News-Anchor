import os
import requests
import subprocess
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from newsapi import NewsApiClient

# --- MODULE 0: CONFIGURATION & APIs ---
NEWS_API_KEY = "233662d7c1c240f29ee9f391a1a08f26" # Make sure this key is active and valid

# --- LOCAL TOOL CONFIG ---
WAV2LIP_PATH = "/Users/mac/Documents/ai content/Wav2Lip"
BASE_AVATAR_VIDEO = "avatar.mp4"

# --- SCRIPT SETUP ---
newsapi = NewsApiClient(api_key=NEWS_API_KEY)

# --- MODULE 1: NEWS GATHERING ---
def get_top_indian_news(count=5):
    """Gets top news headlines from India."""
    print("[INFO] Fetching top Indian news headlines...")
    try:
        # FIXED: Use 'q' parameter for the free NewsAPI plan instead of 'country'.
        top_headlines = newsapi.get_top_headlines(sources='the-times-of-india', language='en', page_size=count)
        
        articles = [
            {"title": article['title'], "description": article.get('description', '')}
            for article in top_headlines.get('articles', [])
            if article.get('title') and "[Removed]" not in article['title'] and article.get('description')
        ]
        if not articles:
             # Handle case where API returns results but they are all filtered out
             print("[WARNING] API returned results, but they were empty or invalid after filtering.")
             return []
        
        print(f"[SUCCESS] Found {len(articles)} headlines.")
        return articles
    except Exception as e:
        # FIXED: Print the actual error for better debugging
        print(f"❌ Error fetching news: {e}")
        return []

# --- MODULE 2: SCRIPT GENERATION ---
def generate_single_script(news_item):
    """Generates a short script for a single news item using a free OpenRouter model."""
    print(f"[INFO] Generating script for: {news_item['title']}")
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": "Bearer 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"},
            json={
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [
                    {"role": "system", "content": "You are a professional news anchor. Create a short, 45-second script for a single news story. Start with the headline, then give a brief summary. Be clear and engaging."},
                    {"role": "user", "content": f"Headline: {news_item['title']}\n\nDetails: {news_item['description']}"}
                ]
            }
        )
        response.raise_for_status()
        script = response.json()['choices'][0]['message']['content'].strip()
        print("[SUCCESS] Script generated.")
        return script
    except Exception as e:
        print(f"❌ Error generating script: {e}")
        return None

# --- MODULE 3: VOICEOVER GENERATION (LOCAL) ---
def generate_voiceover_local(script, output_path):
    """Generates voiceover using local Coqui TTS."""
    print(f"[INFO] Generating voiceover locally with Coqui TTS to {output_path}...")
    try:
        from TTS.api import TTS
        tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)
        tts.tts_to_file(text=script, file_path=output_path)
        print(f"[SUCCESS] Local voiceover saved to {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ Error in local TTS: {e}")
        return None

# --- MODULE 4: AVATAR VIDEO GENERATION (LOCAL) ---
def generate_avatar_video_local(audio_path, output_path):
    """Uses local Wav2Lip installation to sync audio with the avatar video."""
    print("[INFO] Generating AI avatar video with local Wav2Lip...")
    
    # FIXED: Correctly join paths using os.path.join
    inference_script = os.path.join(WAV2LIP_PATH, 'inference.py')
    checkpoint_file = os.path.join(WAV2LIP_PATH, 'checkpoints', 'wav2lip.pth')

    command = [
        'python', inference_script,
        '--checkpoint_path', checkpoint_file,
        '--face', BASE_AVATAR_VIDEO,
        '--audio', audio_path,
        '--outfile', output_path,
        '--pads', '0', '20', '0', '0'
    ]
    
    try:
        # Run the command from within the Wav2Lip directory for cleaner execution
        subprocess.run(command, check=True, capture_output=True, text=True, cwd=WAV2LIP_PATH)
        print(f"[SUCCESS] Local avatar video saved to {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running local Wav2Lip. It might need a GPU.")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return None

# --- MODULE 5: THUMBNAIL GENERATION (LOCAL) ---
def generate_thumbnail_local(headline, output_path, width=1280, height=720):
    """Creates a basic news thumbnail locally using Pillow."""
    print(f"[INFO] Generating thumbnail locally to {output_path}...")
    img = Image.new('RGB', (width, height), color = (20, 20, 60)) # Dark blue background
    d = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("Arial.ttf", 70) # Changed to standard Arial
    except IOError:
        font = ImageFont.load_default()
        print("[WARNING] Arial font not found. Using default.")

    lines = []
    words = headline.split()
    current_line = ""
    for word in words:
        if d.textlength(current_line + " " + word, font=font) <= width * 0.9:
            current_line += " " + word
        else:
            lines.append(current_line.strip())
            current_line = word
    lines.append(current_line.strip())
    
    y_text = (height - (len(lines) * 80)) / 2
    for line in lines:
        text_width = d.textlength(line, font=font)
        d.text(((width - text_width) / 2, y_text), line, font=font, fill=(255, 255, 255))
        y_text += 80

    img.save(output_path)
    print(f"[SUCCESS] Thumbnail saved to {output_path}")
    return output_path

# --- MODULE 6: YOUTUBE UPLOAD (Placeholder) ---
def schedule_for_youtube(video_path, thumb_path, title, description, publish_at_iso):
    """Placeholder for scheduling a YouTube upload."""
    print("\n--- 🚀 Ready for YouTube Schedule 🚀 ---")
    print(f"Title: {title}")
    print(f"Video: {video_path}")
    print(f"Thumbnail: {thumb_path}")
    print(f"Scheduled Time (ISO 8601): {publish_at_iso}")
    print("------------------------------------------\n")

# --- MAIN WORKFLOW ---
def main():
    print("✅ Starting AI Content Agent: 5-Video Daily News Workflow")
    os.makedirs("output", exist_ok=True)
    
    top_5_news = get_top_indian_news(count=5)
    if not top_5_news:
        print("❌ Could not fetch news. Exiting.")
        return

    for i, news_item in enumerate(top_5_news):
        print(f"\n--- PROCESSING VIDEO {i+1} of {len(top_5_news)} ---")
        
        # FIXED: Define file paths properly using a prefix
        file_prefix = f"output/news_{datetime.now().strftime('%Y%m%d')}_{i+1}"
        audio_file = f"{file_prefix}_voice.wav"
        video_file = f"{file_prefix}_final.mp4"
        thumb_file = f"{file_prefix}_thumb.jpg"

        script = generate_single_script(news_item)
        if not script: continue

        if not generate_voiceover_local(script, audio_file):
            continue

        if not generate_avatar_video_local(audio_file, video_file):
            continue

        if not generate_thumbnail_local(news_item['title'], thumb_file):
            continue

        today_date = datetime.now().strftime("%d %b, %Y")
        video_title = f"India News: {news_item['title']} | {today_date}"
        description = f"Today's report on: {news_item['title']}.\n\n{news_item['description']}\n\n#IndiaNews #BreakingNews #AINews" 
        
        publish_time = datetime.now().replace(hour=9 + i*3, minute=0, second=0, microsecond=0)
        publish_iso = publish_time.isoformat() + "Z" # Simplified ISO format

        schedule_for_youtube(video_file, thumb_file, video_title, description, publish_iso)

    print("✅ Full workflow completed. 5 videos are ready for upload.")

if __name__ == "__main__":
    main()