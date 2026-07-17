import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update initializeAffiliateDashboard
replacement1 = """
    setLevel3Count(finalL3Count);
    setPendingReferralReward(finalVesting + finalMatrix + finalSqueeze);
"""
content = content.replace("setLevel3Count(finalL3Count);", replacement1.strip())

# Remove affiliate updates from refreshBalances sandbox mode
pattern = re.compile(r'      // Let\'s ensure the user has some interactive mock downline data in Sandbox Mode.*?setPendingReferralReward\(15\.5\);', re.DOTALL)
content = pattern.sub('// Affiliate Hub mock data generation is now handled deterministically by initializeAffiliateDashboard', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated App.tsx")
