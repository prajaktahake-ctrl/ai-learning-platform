# from transformers import AutoModelForCausalLM, AutoTokenizer
# import torch

# model_name = "Qwen/Qwen2.5-3B-Instruct"

# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(
#     model_name,
#     torch_dtype=torch.float16,
#     device_map="auto"
# )

# def generate_text(prompt: str):

#     inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

#     outputs = model.generate(
#         **inputs,
#         max_new_tokens=500,
#         temperature=0.7,
#         do_sample=True
#     )

#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)

#     # remove prompt from response
#     response = response.replace(prompt, "").strip()

#     print("LLM RESPONSE:", response)

#     return response



import os
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_name = "google/gemma-2b-it"
HF_TOKEN = os.getenv("HF_TOKEN")

tokenizer = AutoTokenizer.from_pretrained(model_name, token=HF_TOKEN)

# bnb_config = BitsAndBytesConfig(
#     load_in_4bit=True,
#     bnb_4bit_compute_dtype=torch.float16,   # faster compute
#     bnb_4bit_use_double_quant=True,         # slightly better accuracy
#     bnb_4bit_quant_type="nf4"              # best quality 4-bit format
# )

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    token=HF_TOKEN,
    # quantization_config=bnb_config,
    torch_dtype=torch.float16,
    device_map="auto",
    low_cpu_mem_usage=True
)

def generate_text(prompt: str):
    formatted_prompt = f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n"

    inputs = tokenizer(formatted_prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=500,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

    input_length = inputs["input_ids"].shape[-1]
    new_tokens = outputs[0][input_length:]
    response = tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    print("LLM RESPONSE:", response)
    return response