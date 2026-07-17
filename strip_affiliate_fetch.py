import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will find the exact string that begins this block
start_str = "// Fetch dynamic on-chain referral downline and earnings via optimized hybrid state scan & fallback"

# Find the end of this try/catch block
end_str = """            if (onChainReferrer !== '0x0000000000000000000000000000000000000000') {"""

idx1 = content.find(start_str)
idx2 = content.find(end_str)

if idx1 != -1 and idx2 != -1 and idx2 > idx1:
    new_content = content[:idx1] + content[idx2:]
    with open('src/App.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print(f"Failed. idx1: {idx1}, idx2: {idx2}")

