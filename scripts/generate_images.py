"""Generate Five Agra Select landing page images using Gemini Nano Banana."""
import asyncio
import os
import base64
import sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

OUT = Path("/app/frontend/public/images")
OUT.mkdir(parents=True, exist_ok=True)

IMAGES = [
    ("hero",
     "Cinematic ultra-wide photograph: golden sunrise over endless rolling green Ukrainian wheat and corn fields, distant farmhouse with grain silo on horizon, soft volumetric god-rays through low morning mist, warm golden hour light, dew on crops, photorealistic, National Geographic style, 16:9, depth of field, no text, no logos."),
    ("field-aerial",
     "Top-down aerial drone photograph of vast green and gold Ukrainian agricultural field patterns, geometric crop strips, contour lines and tractor tracks, late afternoon golden light casting long shadows, photorealistic, no text, no people."),
    ("corn",
     "Hyper-detailed product photograph of bright yellow corn (maize) kernels piled in a rustic wooden bowl on a moody dark forest green textured backdrop, soft warm side lighting, shallow depth of field, premium editorial commercial style, no text."),
    ("wheat",
     "Hyper-detailed product photograph of golden milling wheat grains and a wheat ear bundle on a moody dark forest green textured backdrop, soft warm side lighting, premium editorial commercial style, no text."),
    ("sunflower",
     "Hyper-detailed product photograph of striped sunflower seeds piled with a single dried sunflower head on a moody dark forest green textured backdrop, soft warm light, premium editorial style, no text."),
    ("barley",
     "Hyper-detailed product photograph of feed and malting barley grains with a barley ear on a moody dark forest green textured backdrop, soft warm side light, premium editorial style, no text."),
    ("rapeseed",
     "Hyper-detailed product photograph of tiny dark brown rapeseed/canola seeds in a small ceramic dish with bright yellow rapeseed flowers on a moody dark forest green textured backdrop, soft warm light, premium editorial style, no text."),
    ("soybean",
     "Hyper-detailed product photograph of pale beige soybeans piled in a rustic wooden scoop with green soybean pods on a moody dark forest green textured backdrop, soft warm light, premium editorial style, no text."),
    ("farmer",
     "Photograph of a Ukrainian farmer in work clothes and an agronomist with a tablet shaking hands warmly in a green corn field at golden hour sunset, lens flare, photorealistic, candid, warm tones, no text."),
    ("vessel",
     "Photograph of a large bulk cargo grain vessel being loaded at a Black Sea port at sunset, golden orange sky reflecting on water, loading cranes and conveyor pouring golden grain into the hold, dramatic and cinematic, photorealistic, no text."),
]


async def gen_one(name: str, prompt: str):
    target = OUT / f"{name}.png"
    if target.exists():
        print(f"[skip] {name} exists")
        return
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"fiveagra-img-{name}",
        system_message="You generate high-quality, photorealistic commercial photography images."
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    try:
        text, images = await chat.send_message_multimodal_response(msg)
        if images:
            data = base64.b64decode(images[0]["data"])
            with open(target, "wb") as f:
                f.write(data)
            print(f"[ok] {name} ({len(data)} bytes)")
        else:
            print(f"[fail] {name} no images returned. text={text[:80] if text else ''}")
    except Exception as e:
        print(f"[err] {name}: {e}")


async def main():
    for name, prompt in IMAGES:
        await gen_one(name, prompt)


if __name__ == "__main__":
    asyncio.run(main())
