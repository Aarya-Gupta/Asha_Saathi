# app.py
import os
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
import requests # Used for downloading the image and calling your API
import base64   # To handle the audio data from your API

# --- Configuration ---
# This is for local testing only. Do not commit this to a public repository.
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")

API_ENDPOINT = "https://asha-saathi.onrender.com/api/upload" # Your backend API endpoint

# --- Language Mapping ---
LANGUAGE_MAP = {
    'हिन्दी': 'hi',
    'English': 'en',
    'বাংলা': 'bn',
    'తెలుగు': 'te',
    'मराठी': 'mr',
    'தமிழ்': 'ta',
    'اردو': 'ur',
    'ગુજરાતી': 'gu'
}
LANGUAGES = list(LANGUAGE_MAP.keys())

# --- Flask App & Twilio Client Initialization ---
app = Flask(__name__)
# The client will now use the credentials defined above
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# --- In-Memory Session Storage ---
user_sessions = {}

# --- Main Webhook Endpoint ---
@app.route("/whatsapp", methods=['POST'])
def whatsapp_webhook():
    """
    This is the main endpoint that Twilio will call when a message comes in.
    """
    incoming_msg = request.values
    from_number = incoming_msg.get('From', '')
    user_text = incoming_msg.get('Body', '').strip()
    message_sid = incoming_msg.get('MessageSid', '')
    
    session = user_sessions.get(from_number, {'state': 'start', 'lang': 'en'})

    print(f"--- New Message ---")
    print(f"From: {from_number}, State: {session['state']}, Message: '{user_text}'")

    response = MessagingResponse()
    
    # --- State Machine Logic ---
    if session['state'] == 'start':
        if user_text.lower() == 'hi':
            menu_text = "Welcome! Please choose a language by replying with the number:\n"
            for i, lang in enumerate(LANGUAGES):
                menu_text += f"{i+1}. {lang}\n"
            
            response.message(menu_text)
            session['state'] = 'awaiting_language'
        else:
            response.message("Please send 'Hi' to get started.")
    
    elif session['state'] == 'awaiting_language':
        try:
            choice_index = int(user_text) - 1
            if 0 <= choice_index < len(LANGUAGES):
                chosen_language_name = LANGUAGES[choice_index]
                chosen_language_code = LANGUAGE_MAP[chosen_language_name]
                
                session['lang'] = chosen_language_code
                session['state'] = 'ready'
                response.message(f"Language set to {chosen_language_name}. You can now send an image with a caption.")
            else:
                response.message("Invalid number. Please choose a number from the list.")
        except ValueError:
            response.message("Invalid choice. Please reply with a number from the list.")

    elif session['state'] == 'ready':
        num_media = int(incoming_msg.get('NumMedia', 0))
        
        if num_media > 0:
            image_url = incoming_msg.get('MediaUrl0')
            print(f"Image received from user: {image_url}")
            
            try:
                image_response = requests.get(
                    image_url, 
                    auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                )
                image_response.raise_for_status()
                image_data = image_response.content
                
                files = {'reportImage': ('image.jpg', image_data, 'image/jpeg')}
                data = {'language': session['lang']}
                
                print(f"Calling API at {API_ENDPOINT} with language '{session['lang']}'")
                api_response = requests.post(API_ENDPOINT, files=files, data=data)
                api_response.raise_for_status()
                
                result = api_response.json()
                print("API Response Received:", result)
                
                # *** FIX: Parse the correct keys from your API's response ***
                analysis = result.get('analysis', {})
                text_reply = analysis.get('summary')
                audio_base64 = result.get('audioContent')

                if text_reply:
                    response.message(text_reply)
                
                # *** FIX: Handle base64 audio data ***
                if audio_base64:
                    # Decode the base64 string to get the raw audio bytes
                    audio_data = base64.b64decode(audio_base64)
                    
                    # Save the audio data to a file in the static folder
                    audio_filename = f"{message_sid}.mp3"
                    static_folder = os.path.join(os.getcwd(), "static")
                    if not os.path.exists(static_folder):
                        os.makedirs(static_folder)
                    filepath = os.path.join(static_folder, audio_filename)
                    
                    with open(filepath, 'wb') as audio_file:
                        audio_file.write(audio_data)
                    
                    # Construct the public URL for the new audio file
                    base_url = request.host_url
                    public_audio_url = f"{base_url}static/{audio_filename}"
                    print(f"Saved and serving audio at: {public_audio_url}")

                    # Send the audio file URL to the user
                    audio_message = response.message("")
                    audio_message.media(public_audio_url)

            except requests.exceptions.RequestException as e:
                print(f"API call failed: {e}")
                response.message("Sorry, I couldn't connect to the processing service. Please try again later.")
            
        else:
            response.message("Please send an image with a caption to get a response.")

    # Save the updated session state
    user_sessions[from_number] = session
    print(f"Session for {from_number} updated to: {session}")

    return str(response)

# --- Endpoint to Serve Static Audio Files ---
@app.route('/static/<path:filename>')
def serve_static(filename):
    """This endpoint allows Twilio to fetch the generated audio files."""
    return send_from_directory('static', filename)

# --- Run the Flask App ---
if __name__ == "__main__":
    app.run(debug=True)
