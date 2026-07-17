import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove the old `levels` useState
levels_decl = """  // Seed initial referral downline data
  const [levels, setLevels] = useState<ReferralLevelInfo[]>([
    {
      level: 1,
      percentage: 5,
      count: 0,
      earnings: 0,
      members: []
    },
    {
      level: 2,
      percentage: 3,
      count: 0,
      earnings: 0,
      members: []
    },
    {
      level: 3,
      percentage: 2,
      count: 0,
      earnings: 0,
      members: []
    }
  ]);"""

content = content.replace(levels_decl, "")

# 2. Add levels useState above totalEarnings, and replace initializeAffiliateDashboard

init_aff_old = """  const totalEarnings = totalVestingBonus + totalMatrixBonus + totalSqueezeBonus;

  // Sync Referral Data: Stage 1 (Init) & Stage 3 (Real-time)
  const initializeAffiliateDashboard = useCallback((connectedWallet: string) => {
    setIsInitializingData(true);
    
    const userWallet = connectedWallet ? connectedWallet.toLowerCase() : "";
    
    let finalVesting = 0;
    let finalL1 = 0;
    let finalL2 = 0;
    let finalL3 = 0;
    let finalMatrix = 0;
    let finalSqueeze = 0;
    
    let finalL1Count = 0;
    let finalL2Count = 0;
    let finalL3Count = 0;

    // Jika user yang login adalah wallet penguji Anda:
    if (userWallet === "0xaf1202d170e329a466518233d0aae30f8e800cb5") {
        // Kalkulasi 2 referal L1 (Vesting 5% = 0.5 USDT x 2 = 1.0 USDT)
        finalL1 = 1.0;
        // Kalkulasi 2 referal L2 (Vesting 3% = 0.3 USDT x 2 = 0.6 USDT)
        finalL2 = 0.6;
        finalL3 = 0.0;
        
        finalL1Count = 2;
        finalL2Count = 2;
        finalL3Count = 0;
        
        finalVesting = finalL1 + finalL2 + finalL3; // 1.6 USDT
        finalMatrix = 1.0;  // 2 referal x $0.5 bonus matrix
        finalSqueeze = 0.2; // Beberapa referrals x $0.1 bonus squeeze
    }
    
    const totalEarningsCalculated = finalVesting + finalMatrix + finalSqueeze;
    
    setTotalVestingBonus(finalVesting);
    setTotalVestingBonusL1(finalL1);
    setTotalVestingBonusL2(finalL2);
    setTotalVestingBonusL3(finalL3);
    setTotalMatrixBonus(finalMatrix);
    setTotalSqueezeBonus(finalSqueeze);
    setLevel1Count(finalL1Count);
    setLevel2Count(finalL2Count);
    setLevel3Count(finalL3Count);
    
    setVestingLogs([]);
    setMatrixLogs([]);
    setSqueezeLogs([]);
    setSqueezeHistory([]);
    setAffiliateDebugLogs(["[DEBUG] Local Mock State Initialized successfully without RPC dependency."]);

    setIsInitializingData(false);
    return () => {};
  }, []);"""

init_aff_new = """  const [levels, setLevels] = useState<ReferralLevelInfo[]>([
    { level: 1, percentage: 5, count: 0, earnings: 0, members: [] },
    { level: 2, percentage: 3, count: 0, earnings: 0, members: [] },
    { level: 3, percentage: 2, count: 0, earnings: 0, members: [] }
  ]);

  const totalEarnings = totalVestingBonus + totalMatrixBonus + totalSqueezeBonus;

  // Sync Referral Data: Stage 1 (Init) & Stage 3 (Real-time)
  const initializeAffiliateDashboard = useCallback((connectedWallet: string) => {
    setIsInitializingData(true);
    
    const finalL1 = 1.0;
    const finalL2 = 0.6;
    const finalL3 = 0.0;
    
    const finalL1Count = 2;
    const finalL2Count = 2;
    const finalL3Count = 0;
    
    const finalVesting = finalL1 + finalL2 + finalL3; // 1.6 USDT
    const finalMatrix = 1.0;  // 2 referal x $0.5 bonus matrix
    const finalSqueeze = 0.2; // Beberapa referrals x $0.1 bonus squeeze
    
    setTotalVestingBonus(finalVesting);
    setTotalVestingBonusL1(finalL1);
    setTotalVestingBonusL2(finalL2);
    setTotalVestingBonusL3(finalL3);
    setTotalMatrixBonus(finalMatrix);
    setTotalSqueezeBonus(finalSqueeze);
    setLevel1Count(finalL1Count);
    setLevel2Count(finalL2Count);
    setLevel3Count(finalL3Count);

    const mockL1Members = [
      { address: "0x7a39e3F9Bf12B4...4281", joinedAt: Date.now() - 4 * 3600000, amount: 2.5, depositVestingBonus: 2.0, buyMatrixBonus: 0.5, squeezeBonus: 0.0 },
      { address: "0x2c1fE9eA0ab5Cd...90ab", joinedAt: Date.now() - 24 * 3600000, amount: 5.0, depositVestingBonus: 5.0, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }
    ];
    
    const mockL2Members = [
      { address: "0x89fD5c6c22c0C3...05bc", joinedAt: Date.now() - 48 * 3600000, amount: 1.5, depositVestingBonus: 1.5, buyMatrixBonus: 0.0, squeezeBonus: 0.0 },
      { address: "0x39aCd12b6B4cdE...778e", joinedAt: Date.now() - 72 * 3600000, amount: 3.0, depositVestingBonus: 2.5, buyMatrixBonus: 0.5, squeezeBonus: 0.0 }
    ];
    
    setLevels([
      { level: 1, percentage: 5, count: finalL1Count, earnings: finalL1, members: mockL1Members },
      { level: 2, percentage: 3, count: finalL2Count, earnings: finalL2, members: mockL2Members },
      { level: 3, percentage: 2, count: finalL3Count, earnings: finalL3, members: [] }
    ]);
    
    setMatrixContributors(["0x7a39e3F9Bf12B4...4281", "0x39aCd12b6B4cdE...778e"]);
    setSqueezeHistory([
      { positionId: 42, downline: "0xe0a17C3927B5eD...3927", bonus: 0.1, txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" },
      { positionId: 58, downline: "0x89fD5c6c22c0C3...05bc", bonus: 0.1, txHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321" }
    ]);
    
    setVestingLogs([]);
    setMatrixLogs([]);
    setSqueezeLogs([]);
    setAffiliateDebugLogs(["[DEBUG] Local Mock State Initialized successfully without RPC dependency."]);

    setIsInitializingData(false);
    return () => {};
  }, []);"""

if init_aff_old in content:
    content = content.replace(init_aff_old, init_aff_new)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find init_aff_old block")
