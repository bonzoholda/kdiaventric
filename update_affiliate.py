import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

replacement = """
  const generateDeterministicMockData = (walletAddress: string) => {
    // Generate a simple numeric seed from the wallet address
    let seed = 0;
    if (walletAddress) {
      for (let i = 0; i < walletAddress.length; i++) {
        seed += walletAddress.charCodeAt(i);
      }
    }
    
    // Seeded random generator
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const generateMembers = (level: number, baseCount: number) => {
      const count = Math.floor(random() * baseCount);
      const members = [];
      const percentage = level === 1 ? 0.05 : level === 2 ? 0.03 : 0.02;
      
      for (let i = 0; i < count; i++) {
        const amount = Math.floor(random() * 95 + 5); // 5 to 100
        const depositVestingBonus = amount * percentage;
        const buyMatrixBonus = random() > 0.7 ? 0.5 : 0.0;
        const address = `0x${Math.floor(random() * 0xffffff).toString(16).padStart(6, '0')}...${Math.floor(random() * 0xffff).toString(16).padStart(4, '0')}`;
        
        members.push({
          address,
          joinedAt: Date.now() - Math.floor(random() * 100 * 3600000),
          amount,
          depositVestingBonus,
          buyMatrixBonus,
          squeezeBonus: 0.0
        });
      }
      return members;
    };

    const mockL1Members = generateMembers(1, 10);
    const mockL2Members = generateMembers(2, 15);
    const mockL3Members = generateMembers(3, 20);

    return { mockL1Members, mockL2Members, mockL3Members };
  };

  const initializeAffiliateDashboard = useCallback((connectedWallet: string) => {
    setIsInitializingData(true);
    
    const { mockL1Members, mockL2Members, mockL3Members } = generateDeterministicMockData(connectedWallet);

    const finalL1 = mockL1Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL2 = mockL2Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL3 = mockL3Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    
    const finalL1Count = mockL1Members.length;
    const finalL2Count = mockL2Members.length;
    const finalL3Count = mockL3Members.length;
    
    const finalVesting = finalL1 + finalL2 + finalL3;
    const finalMatrix = mockL1Members.reduce((sum, m) => sum + m.buyMatrixBonus, 0) + 
                        mockL2Members.reduce((sum, m) => sum + m.buyMatrixBonus, 0) + 
                        mockL3Members.reduce((sum, m) => sum + m.buyMatrixBonus, 0);
    
    // Determine squeeze bonus based on seed
    let seed = 0;
    if (connectedWallet) {
      for (let i = 0; i < connectedWallet.length; i++) {
        seed += connectedWallet.charCodeAt(i);
      }
    }
    const finalSqueeze = (seed % 10) * 0.1; 
    
    setTotalVestingBonus(finalVesting);
    setTotalVestingBonusL1(finalL1);
    setTotalVestingBonusL2(finalL2);
    setTotalVestingBonusL3(finalL3);
    setTotalMatrixBonus(finalMatrix);
    setTotalSqueezeBonus(finalSqueeze);
    setLevel1Count(finalL1Count);
    setLevel2Count(finalL2Count);
    setLevel3Count(finalL3Count);
    
    setLevels([
      { level: 1, percentage: 5, count: finalL1Count, earnings: finalL1, members: mockL1Members },
      { level: 2, percentage: 3, count: finalL2Count, earnings: finalL2, members: mockL2Members },
      { level: 3, percentage: 2, count: finalL3Count, earnings: finalL3, members: mockL3Members }
    ]);
    
    // Dummy contributors based on random logic
    const allMatrixContributors = [...mockL1Members, ...mockL2Members, ...mockL3Members]
      .filter(m => m.buyMatrixBonus > 0)
      .map(m => m.address);
    setMatrixContributors(allMatrixContributors);

    const squeezeHistoryData = [];
    const squeezeCount = seed % 4;
    for(let i=0; i < squeezeCount; i++) {
      squeezeHistoryData.push({
        positionId: 42 + i * 5, 
        downline: `0x${(seed * i % 0xffffff).toString(16).padStart(6, '0')}...${(seed % 0xffff).toString(16).padStart(4, '0')}`, 
        bonus: 0.1, 
        txHash: `0x${(seed * 1234567890 + i).toString(16).padStart(64, '0')}`
      });
    }
    setSqueezeHistory(squeezeHistoryData);
    
    setVestingLogs([]);
    setMatrixLogs([]);
    setSqueezeLogs([]);
    setAffiliateDebugLogs([`[DEBUG] Local Mock State Initialized successfully for ${connectedWallet || "unknown"} without RPC dependency.`]);
    setIsInitializingData(false);
    return () => {};
  }, []);
"""

# Try to find the exact block of initializeAffiliateDashboard
pattern = re.compile(r'  const initializeAffiliateDashboard = useCallback\(\(connectedWallet: string\) => \{.*?return \(\) => \{\};\n  \}, \[\]\);', re.DOTALL)
new_content = pattern.sub(replacement.strip(), content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)

print("Updated App.tsx")
