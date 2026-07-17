import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the setupLiveListeners useEffect block
pattern = re.compile(r'\s*// Set up real-time listeners\s*useEffect\(\(\) => \{.*?\}, \[wallet\.connected, wallet\.address, controllerAddress, microFifoAddress, useSandboxMode\]\);', re.DOTALL)
content = pattern.sub('', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
