import ollama
import json
import re

def generate_text(prompt: str):

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    output = response["message"]["content"]

    print("LLM RESPONSE:", output)

    return output

# def generate_json(prompt: str):
#     raw = generate_text(prompt)
#     print("RAW LLM OUTPUT:", raw)

#     try:
#         return json.loads(raw)
#     except:
#         # Handle ```json ... ``` cases
#         cleaned = raw.strip()

#         if "```" in cleaned:
#             cleaned = cleaned.split("```")[-1]

#         return json.loads(cleaned)

def generate_json(prompt: str):
    raw = generate_text(prompt)

    print("RAW LLM OUTPUT:", raw)

    if not raw or raw.strip() == "":
        raise Exception("Empty response from LLM")

    cleaned = raw.strip()

    # 🔥 Extract ONLY JSON array
    start = cleaned.find("[")
    end = cleaned.rfind("]")

    if start == -1 or end == -1:
        raise Exception("No JSON array found in LLM output")

    json_str = cleaned[start:end + 1]

    # 🔥 FIX 1: remove trailing commas
    json_str = re.sub(r",\s*([\]}])", r"\1", json_str)

    # 🔥 FIX 2: remove invalid control chars
    json_str = json_str.replace("\n", " ").replace("\r", " ")

    try:
        return json.loads(json_str)
    except Exception as e:
        print("FAILED JSON STRING:", json_str)
        raise Exception(f"JSON parsing failed: {e}")