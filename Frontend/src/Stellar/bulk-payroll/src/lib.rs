#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    token, Address, Env, Vec, Symbol,
};

// Define custom error types
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    LengthMismatch = 1,
    InsufficientBalance = 2,
    TransferFailed = 3,
}

// Define the contract
#[contract]
pub struct BulkPayroll;

// Implement the contract
#[contractimpl]
impl BulkPayroll {
    pub fn bulk_transfer(
        env: Env,
        sender: Address,
        token_id: Address,
        recipients: Vec<Address>,
        amounts: Vec<i128>,
    ) -> Result<(), Error> {
        sender.require_auth();

        if recipients.len() != amounts.len() {
            return Err(Error::LengthMismatch);
        }

        let total: i128 = amounts.iter().sum();

        Self::transfer_asset(&env, &sender, &token_id, total, &recipients, &amounts)?;

        env.events().publish(
            (Symbol::new(&env, "bulk_transfer"), sender),
            (token_id, recipients.len() as u32, total),
        );

        Ok(())
    }

    fn transfer_asset(
        env: &Env,
        sender: &Address,
        token_id: &Address,
        _total: i128,
        recipients: &Vec<Address>,
        amounts: &Vec<i128>,
    ) -> Result<(), Error> {
        let client = token::Client::new(env, token_id);

        if client.balance(sender) < _total {
            return Err(Error::InsufficientBalance);
        }

        for (recipient, amount) in recipients.iter().zip(amounts.iter()) {
            client.transfer(sender, &recipient, &amount);
        }

        Ok(())
    }
}

// Error conversion implementations
impl From<soroban_sdk::Error> for Error {
    fn from(_: soroban_sdk::Error) -> Self {
        Error::TransferFailed
    }
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::LengthMismatch => soroban_sdk::Error::from_contract_error(1),
            Error::InsufficientBalance => soroban_sdk::Error::from_contract_error(2),
            Error::TransferFailed => soroban_sdk::Error::from_contract_error(3),
        }
    }
}

impl<'a> From<&'a Error> for soroban_sdk::Error {
    fn from(e: &'a Error) -> Self {
        (*e).into()
    }
}