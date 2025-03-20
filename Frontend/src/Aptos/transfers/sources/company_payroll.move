module company_payroll::company_payroll {
    use std::vector;
    use std::signer;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::hash;

    /// The Payroll resource holds company data and employee salary hash records.
    struct Payroll has key {
        company_id: vector<u8>,
        company_name: vector<u8>,
        deployer: address,
        employee_salary_hashes: Table<vector<u8>, vector<u8>>,
        employee_ids: vector<vector<u8>>
    }

    // Error codes for various failure conditions.
    const E_COMPANY_ID_ZERO: u64 = 1;
    const E_COMPANY_NAME_EMPTY: u64 = 2;
    const E_EMPLOYEE_ID_EMPTY: u64 = 3;
    const E_SALARY_EMPTY: u64 = 4;
    const E_SAME_HASH: u64 = 5;
    const E_NOT_DEPLOYER: u64 = 6;
    const E_PAYROLL_EXISTS: u64 = 7;
    const E_PAYROLL_NOT_FOUND: u64 = 8;
    const E_EMPLOYEE_NOT_FOUND: u64 = 9;

    /// Initializes the Payroll resource.
    /// - `company_id`: a unique identifier (non-empty byte vector)
    /// - `company_name`: company name (non-empty byte vector)
    /// Must be called by the deployer.
    public entry fun initialize(deployer: &signer, company_id: vector<u8>, company_name: vector<u8>) {
        // Check if the Payroll resource already exists
        let deployer_addr = signer::address_of(deployer);
        assert!(!exists<Payroll>(deployer_addr), E_PAYROLL_EXISTS);
        
        // Validate input parameters
        assert!(vector::length(&company_id) > 0, E_COMPANY_ID_ZERO);
        assert!(vector::length(&company_name) > 0, E_COMPANY_NAME_EMPTY);
        
        let employee_salary_hashes = table::new<vector<u8>, vector<u8>>();
        let employee_ids = vector::empty<vector<u8>>();
        
        let payroll = Payroll {
            company_id,
            company_name,
            deployer: deployer_addr,
            employee_salary_hashes,
            employee_ids,
        };
        move_to(deployer, payroll);
    }

    /// Sets or updates an employee's salary hash.
    public entry fun set_employee_salary_hash(
        deployer: &signer, 
        employee_id: vector<u8>, 
        salary: vector<u8>
    ) acquires Payroll {
        let deployer_addr = signer::address_of(deployer);
        
        // Check if the Payroll resource exists
        assert!(exists<Payroll>(deployer_addr), E_PAYROLL_NOT_FOUND);
        
        // Borrow a mutable reference to Payroll stored under the caller's address
        let payroll = borrow_global_mut<Payroll>(deployer_addr);
        
        // Verify that the caller is the original deployer
        assert!(deployer_addr == payroll.deployer, E_NOT_DEPLOYER);
        
        // Validate input parameters
        assert!(vector::length(&employee_id) > 0, E_EMPLOYEE_ID_EMPTY);
        assert!(vector::length(&salary) > 0, E_SALARY_EMPTY);
        
        // Compute the hash of the salary details
        let new_hash = hash::sha3_256(salary);
        
        // If the employee already exists, check that the new hash is different
        if (table::contains(&payroll.employee_salary_hashes, employee_id)) {
            let old_hash = *table::borrow(&payroll.employee_salary_hashes, employee_id);
            assert!(old_hash != new_hash, E_SAME_HASH);
            
            // Update the hash value
            table::upsert(&mut payroll.employee_salary_hashes, employee_id, new_hash);
        } else {
            // For a new employee, record the employee ID and insert the hash
            vector::push_back(&mut payroll.employee_ids, copy employee_id);
            table::add(&mut payroll.employee_salary_hashes, employee_id, new_hash);
        };
    }

    /// Retrieves the salary hash for a given employee.
    public fun get_employee_salary_hash(
        account: address, 
        employee_id: vector<u8>
    ): vector<u8> acquires Payroll {
        assert!(exists<Payroll>(account), E_PAYROLL_NOT_FOUND);
        
        let payroll = borrow_global<Payroll>(account);
        assert!(table::contains(&payroll.employee_salary_hashes, employee_id), E_EMPLOYEE_NOT_FOUND);
        
        *table::borrow(&payroll.employee_salary_hashes, employee_id)
    }

    /// Retrieves all employee details.
    public fun get_all_employee_details(
        account: address
    ): (vector<vector<u8>>, vector<vector<u8>>) acquires Payroll {
        assert!(exists<Payroll>(account), E_PAYROLL_NOT_FOUND);
        
        let payroll = borrow_global<Payroll>(account);
        let count = vector::length(&payroll.employee_ids);
        let salaries = vector::empty<vector<u8>>();
        
        let i = 0;
        while (i < count) {
            let emp_id = *vector::borrow(&payroll.employee_ids, i);
            let salary = *table::borrow(&payroll.employee_salary_hashes, emp_id);
            vector::push_back(&mut salaries, salary);
            i = i + 1;
        };
        
        // Create a copy of the employee_ids vector
        let employee_ids_copy = *&payroll.employee_ids;
        
        (employee_ids_copy, salaries)
    }
    
    /// Check if an employee exists in the payroll system.
    public fun employee_exists(
        account: address, 
        employee_id: vector<u8>
    ): bool acquires Payroll {
        if (!exists<Payroll>(account)) {
            return false
        };
        
        let payroll = borrow_global<Payroll>(account);
        table::contains(&payroll.employee_salary_hashes, employee_id)
    }
    
    /// Get company information.
    public fun get_company_info(
        account: address
    ): (vector<u8>, vector<u8>) acquires Payroll {
        assert!(exists<Payroll>(account), E_PAYROLL_NOT_FOUND);
        
        let payroll = borrow_global<Payroll>(account);
        let company_id_copy = *&payroll.company_id;
        let company_name_copy = *&payroll.company_name;
        (company_id_copy, company_name_copy)
    }
    
    /// Returns the number of employees in the payroll.
    public fun get_employee_count(
        account: address
    ): u64 acquires Payroll {
        assert!(exists<Payroll>(account), E_PAYROLL_NOT_FOUND);
        
        let payroll = borrow_global<Payroll>(account);
        vector::length(&payroll.employee_ids)
    }
}