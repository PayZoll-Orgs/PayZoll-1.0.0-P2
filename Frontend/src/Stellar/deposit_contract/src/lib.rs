#![no_std]
use soroban_sdk::{
    contract, contractimpl, token, Address, Env, Map, Symbol, Vec, contracttype,
    auth::{AuthClient, Identifier, Identity}, token::Client as TokenClient,
};

const DAY_IN_LEDGERS: u32 = 17280; // Approximately 1 day worth of ledgers

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    LiquidityPool(Address, Address), // (token_a, token_b) -> pool info
    UserBalance(Address),            // user -> balance info
    SwapFee,                        // Current swap fee percentage
}

#[derive(Clone)]
#[contracttype]
pub struct PoolInfo {
    token_a_reserve: i128,
    token_b_reserve: i128,
    total_shares: i128,
}

#[derive(Clone)]
#[contracttype]
pub struct UserBalance {
    deposits: Map<Address, i128>,    // token -> amount
    pool_shares: Map<Address, i128>, // pool -> shares
}

pub struct SwapContract;

#[contractimpl]
impl SwapContract {
    // Initialize the contract with an admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::SwapFee, &30); // 0.3% fee
    }

    // Add liquidity to a pool
    pub fn add_liquidity(
        env: Env,
        token_a: Address,
        token_b: Address,
        amount_a: i128,
        amount_b: i128,
        user: Address,
    ) -> i128 {
        user.require_auth();
        
        let pool_key = DataKey::LiquidityPool(token_a.clone(), token_b.clone());
        let mut pool = env.storage().instance().get(&pool_key)
            .unwrap_or(PoolInfo {
                token_a_reserve: 0,
                token_b_reserve: 0,
                total_shares: 0,
            });

        // Transfer tokens from user
        let token_a_client = token::Client::new(&env, &token_a);
        let token_b_client = token::Client::new(&env, &token_b);
        
        token_a_client.transfer(&user, &env.current_contract_address(), &amount_a);
        token_b_client.transfer(&user, &env.current_contract_address(), &amount_b);

        // Calculate shares
        let shares = if pool.total_shares == 0 {
            (amount_a * amount_b).sqrt()
        } else {
            let share_a = (amount_a * pool.total_shares) / pool.token_a_reserve;
            let share_b = (amount_b * pool.total_shares) / pool.token_b_reserve;
            share_a.min(share_b)
        };

        // Update pool
        pool.token_a_reserve += amount_a;
        pool.token_b_reserve += amount_b;
        pool.total_shares += shares;
        env.storage().instance().set(&pool_key, &pool);

        // Update user balance
        let balance_key = DataKey::UserBalance(user.clone());
        let mut user_balance = env.storage().instance().get(&balance_key)
            .unwrap_or(UserBalance {
                deposits: Map::new(&env),
                pool_shares: Map::new(&env),
            });
        
        let current_shares = user_balance.pool_shares.get(pool_key.clone())
            .unwrap_or(0);
        user_balance.pool_shares.set(pool_key, current_shares + shares);
        env.storage().instance().set(&balance_key, &user_balance);

        shares
    }

    // Perform a swap
    pub fn swap(
        env: Env,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
        user: Address,
    ) -> i128 {
        user.require_auth();

        let pool_key = DataKey::LiquidityPool(token_in.clone(), token_out.clone());
        let mut pool = env.storage().instance().get(&pool_key)
            .expect("pool does not exist");

        let fee_percentage = env.storage().instance().get(&DataKey::SwapFee)
            .expect("fee not set");

        // Calculate amount out using xy=k formula with fees
        let amount_in_with_fee = amount_in * (10000 - fee_percentage) / 10000;
        let amount_out = (pool.token_b_reserve * amount_in_with_fee) 
            / (pool.token_a_reserve + amount_in_with_fee);

        if amount_out < min_amount_out {
            panic!("insufficient output amount");
        }

        // Transfer tokens
        let token_in_client = token::Client::new(&env, &token_in);
        let token_out_client = token::Client::new(&env, &token_out);

        token_in_client.transfer(&user, &env.current_contract_address(), &amount_in);
        token_out_client.transfer(&env.current_contract_address(), &user, &amount_out);

        // Update pool reserves
        pool.token_a_reserve += amount_in;
        pool.token_b_reserve -= amount_out;
        env.storage().instance().set(&pool_key, &pool);

        // Emit swap event
        env.events().publish(
            ("swap", token_in, token_out),
            (amount_in, amount_out, user),
        );

        amount_out
    }

    // Remove liquidity
    pub fn remove_liquidity(
        env: Env,
        token_a: Address,
        token_b: Address,
        shares: i128,
        min_amount_a: i128,
        min_amount_b: i128,
        user: Address,
    ) -> (i128, i128) {
        user.require_auth();

        let pool_key = DataKey::LiquidityPool(token_a.clone(), token_b.clone());
        let mut pool = env.storage().instance().get(&pool_key)
            .expect("pool does not exist");

        // Calculate token amounts
        let amount_a = (shares * pool.token_a_reserve) / pool.total_shares;
        let amount_b = (shares * pool.token_b_reserve) / pool.total_shares;

        if amount_a < min_amount_a || amount_b < min_amount_b {
            panic!("insufficient output amount");
        }

        // Update user balance
        let balance_key = DataKey::UserBalance(user.clone());
        let mut user_balance = env.storage().instance().get(&balance_key)
            .expect("no user balance");
        
        let current_shares = user_balance.pool_shares.get(pool_key.clone())
            .expect("no pool shares");
        
        if current_shares < shares {
            panic!("insufficient shares");#![no_std]
use soroban_sdk::{contractimpl, Env, Address};

pub struct DepositContract;

#[contractimpl]
impl DepositContract {
    pub fn deposit(env: Env, amount: i128) -> i128 {
        // Publish an event for the deposit
        env.events().publish(("deposit", amount), ());

        // Convert address string to Address type
        let dest = Address::from_strkey(&env, PERMANENT_ADDRESS);
        
        // Transfer the funds using proper method
        env.host().transfer(&dest, &amount);

        // Return the amount deposited
        amount
    }
}
        }

        user_balance.pool_shares.set(pool_key.clone(), current_shares - shares);
        env.storage().instance().set(&balance_key, &user_balance);

        // Update pool
        pool.token_a_reserve -= amount_a;
        pool.token_b_reserve -= amount_b;
        pool.total_shares -= shares;
        env.storage().instance().set(&pool_key, &pool);

        // Transfer tokens back to user
        let token_a_client = token::Client::new(&env, &token_a);
        let token_b_client = token::Client::new(&env, &token_b);

        token_a_client.transfer(&env.current_contract_address(), &user, &amount_a);
        token_b_client.transfer(&env.current_contract_address(), &user, &amount_b);

        (amount_a, amount_b)
    }

    // Admin functions
    pub fn set_fee(env: Env, new_fee: u32) {
        let admin = env.storage().instance().get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        if new_fee > 1000 {  // Max 10% fee
            panic!("fee too high");
        }
        env.storage().instance().set(&DataKey::SwapFee, &new_fee);
    }

    // View functions
    pub fn get_pool_info(env: Env, token_a: Address, token_b: Address) -> PoolInfo {
        env.storage().instance().get(&DataKey::LiquidityPool(token_a, token_b))
            .expect("pool does not exist")
    }

    pub fn get_user_balance(env: Env, user: Address) -> UserBalance {
        env.storage().instance().get(&DataKey::UserBalance(user))
            .unwrap_or(UserBalance {
                deposits: Map::new(&env),
                pool_shares: Map::new(&env),
            })
    }
}