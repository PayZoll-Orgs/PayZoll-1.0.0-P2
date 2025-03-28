#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Token};
    use soroban_sdk::{testutils::Events, Env};

    #[test]
    fn test_bulk_transfer_native() {
        let env = Env::default();
        let contract_id = env.register_contract(None, BulkPayroll);
        
        // Create test accounts
        let sender = Address::generate(&env);
        let recipient1 = Address::generate(&env);
        let recipient2 = Address::generate(&env);
        
        // Create token client for native token
        let token_client = token::Client::new(&env, &token::NATIVE_ID);
        
        // Fund sender with XLM
        token_client.mint(&sender, &1000);
        
        // Test arrays
        let recipients = Vec::from_array(&env, [recipient1.clone(), recipient2.clone()]);
        let amounts = Vec::from_array(&env, [400_i128, 500_i128]);
        
        // Call the contract
        let client = BulkPayrollClient::new(&env, &contract_id);
        client.bulk_transfer(&sender, &None, &recipients, &amounts);
        
        // Verify balances
        assert_eq!(token_client.balance(&sender), 100);
        assert_eq!(token_client.balance(&recipient1), 400);
        assert_eq!(token_client.balance(&recipient2), 500);
    }
}
