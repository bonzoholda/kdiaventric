import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

init_aff_old = """  // Sync Referral Data: Stage 1 (Init) & Stage 3 (Real-time)
  const initializeAffiliateDashboard = useCallback((connectedWallet: string) => {
    setIsInitializingData(true);
    
    // Level 1: 5% of deposit
    const mockL1Members = [
      { address: "0x7a39e3F9Bf12B4...4281", joinedAt: Date.now() - 4 * 3600000, amount: 3.0, depositVestingBonus: 2.5, buyMatrixBonus: 0.5, squeezeBonus: 0.0 }, // $50 deposit -> 2.5 Vesting
      { address: "0x2c1fE9eA0ab5Cd...90ab", joinedAt: Date.now() - 24 * 3600000, amount: 5.0, depositVestingBonus: 5.0, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $100 deposit -> 5.0 Vesting
      { address: "0x1b4cD2eA1c34Bf...11cd", joinedAt: Date.now() - 30 * 3600000, amount: 1.0, depositVestingBonus: 1.0, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }  // $20 deposit -> 1.0 Vesting
    ];
    
    // Level 2: 3% of deposit
    const mockL2Members = [
      { address: "0x89fD5c6c22c0C3...05bc", joinedAt: Date.now() - 48 * 3600000, amount: 1.2, depositVestingBonus: 1.2, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $40 deposit -> 1.2 Vesting
      { address: "0x39aCd12b6B4cdE...778e", joinedAt: Date.now() - 72 * 3600000, amount: 2.3, depositVestingBonus: 1.8, buyMatrixBonus: 0.5, squeezeBonus: 0.0 } // $60 deposit -> 1.8 Vesting
    ];

    // Level 3: 2% of deposit
    const mockL3Members = [
      { address: "0x4e5B1fA33d02aB...99f1", joinedAt: Date.now() - 96 * 3600000, amount: 1.5, depositVestingBonus: 1.5, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $75 deposit -> 1.5 Vesting
      { address: "0x91cA2dB44e13bC...44a2", joinedAt: Date.now() - 112 * 3600000, amount: 0.2, depositVestingBonus: 0.2, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }  // $10 deposit -> 0.2 Vesting
    ];
    
    const finalL1 = mockL1Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL2 = mockL2Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL3 = mockL3Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    
    const finalL1Count = mockL1Members.length;
    const finalL2Count = mockL2Members.length;
    const finalL3Count = mockL3Members.length;
    
    const finalVesting = finalL1 + finalL2 + finalL3;
    const finalMatrix = 1.0;  // 2 referrals x $0.5 bonus matrix
    const finalSqueeze = 0.2; // 2 referrals x $0.1 bonus squeeze
    
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
      { level: 1, percentage: 5, count: finalL1Count, earnings: mockL1Members.reduce((sum, m) => sum + m.amount, 0), members: mockL1Members },
      { level: 2, percentage: 3, count: finalL2Count, earnings: mockL2Members.reduce((sum, m) => sum + m.amount, 0), members: mockL2Members },
      { level: 3, percentage: 2, count: finalL3Count, earnings: mockL3Members.reduce((sum, m) => sum + m.amount, 0), members: mockL3Members }
    ]);"""

init_aff_new = """  // Sync Referral Data: Stage 1 (Init) & Stage 3 (Real-time)
  const initializeAffiliateDashboard = useCallback((connectedWallet: string) => {
    setIsInitializingData(true);
    
    // Level 1: 5% of deposit
    const mockL1Members = [
      { address: "0x7a39e3F9Bf12B4...4281", joinedAt: Date.now() - 4 * 3600000, amount: 50.0, depositVestingBonus: 2.5, buyMatrixBonus: 0.5, squeezeBonus: 0.0 }, // $50 deposit -> 2.5 Vesting
      { address: "0x2c1fE9eA0ab5Cd...90ab", joinedAt: Date.now() - 24 * 3600000, amount: 100.0, depositVestingBonus: 5.0, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $100 deposit -> 5.0 Vesting
      { address: "0x1b4cD2eA1c34Bf...11cd", joinedAt: Date.now() - 30 * 3600000, amount: 20.0, depositVestingBonus: 1.0, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }  // $20 deposit -> 1.0 Vesting
    ];
    
    // Level 2: 3% of deposit
    const mockL2Members = [
      { address: "0x89fD5c6c22c0C3...05bc", joinedAt: Date.now() - 48 * 3600000, amount: 40.0, depositVestingBonus: 1.2, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $40 deposit -> 1.2 Vesting
      { address: "0x39aCd12b6B4cdE...778e", joinedAt: Date.now() - 72 * 3600000, amount: 60.0, depositVestingBonus: 1.8, buyMatrixBonus: 0.5, squeezeBonus: 0.0 } // $60 deposit -> 1.8 Vesting
    ];

    // Level 3: 2% of deposit
    const mockL3Members = [
      { address: "0x4e5B1fA33d02aB...99f1", joinedAt: Date.now() - 96 * 3600000, amount: 75.0, depositVestingBonus: 1.5, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }, // $75 deposit -> 1.5 Vesting
      { address: "0x91cA2dB44e13bC...44a2", joinedAt: Date.now() - 112 * 3600000, amount: 10.0, depositVestingBonus: 0.2, buyMatrixBonus: 0.0, squeezeBonus: 0.0 }  // $10 deposit -> 0.2 Vesting
    ];
    
    const finalL1 = mockL1Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL2 = mockL2Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    const finalL3 = mockL3Members.reduce((sum, member) => sum + member.depositVestingBonus, 0);
    
    const finalL1Count = mockL1Members.length;
    const finalL2Count = mockL2Members.length;
    const finalL3Count = mockL3Members.length;
    
    const finalVesting = finalL1 + finalL2 + finalL3;
    const finalMatrix = 1.0;  // 2 referrals x $0.5 bonus matrix
    const finalSqueeze = 0.2; // 2 referrals x $0.1 bonus squeeze
    
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
    ]);"""

if init_aff_old in content:
    content = content.replace(init_aff_old, init_aff_new)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Success replacing old init_aff")
else:
    print("Failed to find init_aff_old in content")

