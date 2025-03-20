module bulk_payroll::bulk_payroll {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;

    /// Errors
    const E_LENGTH_MISMATCH: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;

    #[event]
    struct BulkTransferExecuted has drop, store {
        sender: address,
        total_recipients: u64,
        total_amount: u64,
    }

    /// Register CoinStore for AptosCoin
    public entry fun register_coin_store(recipient: &signer) {
        coin::register<AptosCoin>(recipient);
    }

    /// Executes a bulk transfer of APT coins
    public entry fun bulk_transfer(
        sender: &signer,
        recipients: vector<address>,
        amounts: vector<u64>
    ) {
        let length = vector::length(&recipients);
        assert!(length == vector::length(&amounts), E_LENGTH_MISMATCH);

        let total_amount = sum_amounts(&amounts);
        let sender_addr = signer::address_of(sender);
        
        // Check the sender's balance
        let balance = coin::balance<AptosCoin>(sender_addr);
        assert!(balance >= total_amount, E_INSUFFICIENT_BALANCE);

        // Process transfers
        let i = 0;
        while (i < length) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);
            coin::transfer<AptosCoin>(sender, recipient, amount);
            i = i + 1;
        };

        event::emit(BulkTransferExecuted {
            sender: sender_addr,
            total_recipients: length,
            total_amount,
        });
    }

    /// Helper to sum amounts
    fun sum_amounts(amounts: &vector<u64>): u64 {
        let total = 0;
        let length = vector::length(amounts);
        let i = 0;
        while (i < length) {
            total = total + *vector::borrow(amounts, i);
            i = i + 1;
        };
        total
    }

    #[test_only]
    public entry fun test_bulk_transfer(sender: &signer) {
        let recipients = vector::empty<address>();
        let amounts = vector::empty<u64>();
        vector::push_back(&mut recipients, @0x2);
        vector::push_back(&mut amounts, 100);
        bulk_transfer(sender, recipients, amounts);
    }
}