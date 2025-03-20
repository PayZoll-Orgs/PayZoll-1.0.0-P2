#[test_only]
module bulk_payroll::bulk_payroll_tests {
    use std::signer;
    use std::vector;
    use std::string::String;
    use aptos_framework::account;
    use aptos_framework::coin::{Self, MintCapability, BurnCapability};
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use bulk_payroll::bulk_payroll;

    // Error codes
    const E_LENGTH_MISMATCH: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;

    // Test addresses
    const SENDER_ADDR: address = @0x123;
    const RECIPIENT1_ADDR: address = @0x456;
    const RECIPIENT2_ADDR: address = @0x789;
    const RECIPIENT3_ADDR: address = @0xabc;

    /// Initialize the Aptos framework and create test accounts
    fun setup_test(
        aptos_framework: &signer,
    ): (signer, signer, signer, signer, MintCapability<AptosCoin>, BurnCapability<AptosCoin>) {
        // Initialize Aptos coin
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        
        // Create test accounts
        let sender = account::create_account_for_test(SENDER_ADDR);
        let recipient1 = account::create_account_for_test(RECIPIENT1_ADDR);
        let recipient2 = account::create_account_for_test(RECIPIENT2_ADDR);
        let recipient3 = account::create_account_for_test(RECIPIENT3_ADDR);
        
        // Register each account with AptosCoin
        coin::register<AptosCoin>(&sender);
        coin::register<AptosCoin>(&recipient1);
        coin::register<AptosCoin>(&recipient2);
        coin::register<AptosCoin>(&recipient3);
        
        (sender, recipient1, recipient2, recipient3, mint_cap, burn_cap)
    }

    #[test(aptos_framework = @aptos_framework)]
    /// Test successful bulk transfer to multiple recipients
    public fun test_successful_bulk_transfer(aptos_framework: signer) {
        // Setup test
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint coins to sender
        let coins = coin::mint(10000, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Verify initial balances
        assert!(coin::balance<AptosCoin>(SENDER_ADDR) == 10000, 1000);
        assert!(coin::balance<AptosCoin>(RECIPIENT1_ADDR) == 0, 1001);
        assert!(coin::balance<AptosCoin>(RECIPIENT2_ADDR) == 0, 1002);
        assert!(coin::balance<AptosCoin>(RECIPIENT3_ADDR) == 0, 1003);
        
        // Create recipients and amounts vectors
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        vector::push_back(&mut recipients, RECIPIENT1_ADDR);
        vector::push_back(&mut recipients, RECIPIENT2_ADDR);
        vector::push_back(&mut recipients, RECIPIENT3_ADDR);
        
        vector::push_back(&mut amounts, 1000);
        vector::push_back(&mut amounts, 2000);
        vector::push_back(&mut amounts, 3000);
        
        // Execute bulk transfer
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Verify final balances
        assert!(coin::balance<AptosCoin>(SENDER_ADDR) == 4000, 1004); // 10000 - (1000 + 2000 + 3000)
        assert!(coin::balance<AptosCoin>(RECIPIENT1_ADDR) == 1000, 1005);
        assert!(coin::balance<AptosCoin>(RECIPIENT2_ADDR) == 2000, 1006);
        assert!(coin::balance<AptosCoin>(RECIPIENT3_ADDR) == 3000, 1007);
        
        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @aptos_framework)]
    /// Test bulk transfer with a single recipient
    public fun test_single_recipient(aptos_framework: signer) {
        // Setup test
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint coins to sender
        let coins = coin::mint(5000, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Create recipients and amounts vectors
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        vector::push_back(&mut recipients, RECIPIENT1_ADDR);
        vector::push_back(&mut amounts, 2500);
        
        // Execute bulk transfer
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Verify final balances
        assert!(coin::balance<AptosCoin>(SENDER_ADDR) == 2500, 2000);
        assert!(coin::balance<AptosCoin>(RECIPIENT1_ADDR) == 2500, 2001);
        
        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @aptos_framework)]
    /// Test bulk transfer with empty vectors (should do nothing)
    public fun test_empty_vectors(aptos_framework: signer) {
        // Setup test
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint coins to sender
        let coins = coin::mint(1000, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Create empty recipients and amounts vectors
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        // Execute bulk transfer with empty vectors
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Balance should remain unchanged
        assert!(coin::balance<AptosCoin>(SENDER_ADDR) == 1000, 3000);
        
        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @aptos_framework)]
    #[expected_failure(abort_code = bulk_payroll::E_LENGTH_MISMATCH, location = bulk_payroll)]
    /// Test failure when vectors have different lengths
    public fun test_length_mismatch(aptos_framework: signer) {
        // Setup test
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint coins to sender
        let coins = coin::mint(10000, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Create mismatched vectors
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        vector::push_back(&mut recipients, RECIPIENT1_ADDR);
        vector::push_back(&mut recipients, RECIPIENT2_ADDR);
        
        vector::push_back(&mut amounts, 1000);
        // Only one amount for two recipients
        
        // This should fail with E_LENGTH_MISMATCH
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Clean up (won't be reached due to expected failure)
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @aptos_framework)]
    #[expected_failure(abort_code = bulk_payroll::E_INSUFFICIENT_BALANCE, location = bulk_payroll)]
    /// Test failure when sender has insufficient balance
    public fun test_insufficient_balance(aptos_framework: signer) {
        // Setup test
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint coins to sender (only 100)
        let coins = coin::mint(100, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Create recipients and amounts that exceed sender's balance
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        vector::push_back(&mut recipients, RECIPIENT1_ADDR);
        vector::push_back(&mut amounts, 500); // More than the 100 available
        
        // This should fail with E_INSUFFICIENT_BALANCE
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Clean up (won't be reached due to expected failure)
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @aptos_framework)]
    /// Test sum_amounts helper function (via the public interface)
    public fun test_sum_amounts(aptos_framework: signer) {
        // Setup test with large amounts
        let (sender, _recipient1, _recipient2, _recipient3, mint_cap, burn_cap) = 
            setup_test(&aptos_framework);
            
        // Mint large amount of coins to sender
        let coins = coin::mint(1000000, &mint_cap);
        coin::deposit(SENDER_ADDR, coins);
        
        // Create recipients and large amounts
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        
        vector::push_back(&mut recipients, RECIPIENT1_ADDR);
        vector::push_back(&mut recipients, RECIPIENT2_ADDR);
        
        vector::push_back(&mut amounts, 400000);
        vector::push_back(&mut amounts, 500000);
        
        // Execute bulk transfer with large amounts
        bulk_payroll::bulk_transfer(&sender, recipients, amounts);
        
        // Verify final balances
        assert!(coin::balance<AptosCoin>(SENDER_ADDR) == 100000, 5000); // 1000000 - (400000 + 500000)
        assert!(coin::balance<AptosCoin>(RECIPIENT1_ADDR) == 400000, 5001);
        assert!(coin::balance<AptosCoin>(RECIPIENT2_ADDR) == 500000, 5002);
        
        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}