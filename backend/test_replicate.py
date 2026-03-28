import requests
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('HUGGINGFACE_TOKEN')

# Test 1
url1 = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"
# Test 2  
url2 = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
# Test 3
url3 = "https://router.huggingface.co/hf-inference/v1/images/generations"

for i, url in enumerate([url1, url2, url3], 1):
    print(f"\nTest {i}: {url}")
    r = requests.post(url, 
        headers={"Authorization": f"Bearer {token}"},
        json={"inputs": "Pakistani woman in teal shalwar kameez, photorealistic"}
    )
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        with open(f"test_output_{i}.jpg", "wb") as f:
            f.write(r.content)
        print(f"SUCCESS! Saved as test_output_{i}.jpg")
        break
    else:
        print(f"Error: {r.text[:100]}")