import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get(os.getenv("OPENAI_API_KEY")),
)

chat_completion = client.chat.completions.create(
  messages=[
    {
      "role": "user",
      "content": "Cuál es la capital del Perú?",
    }
  ],
  model="gpt-3.5-turbo",
)

print(chat_completion)