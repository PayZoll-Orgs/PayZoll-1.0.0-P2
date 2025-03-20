// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Company Payroll
 * @dev Gas-efficient payroll system with company metadata and deployer tracking
 */


/**
 * USAGE GUIDE:
 *
 * 1. Deploy the contract:
 *    - _companyId: a unique bytes32 identifier for the company (cannot be zero)
 *    - _companyName: a string with the company name (cannot be empty)
 *
 * 2. Setting employee salary:
 *    - Only the owner can call setEmployeeSalaryHash
 *    - employeeId: a unique bytes32 identifier for the employee (cannot be zero)
 *    - salary: a string representation of salary details (cannot be empty)
 *
 * 3. Retrieving employee salary hash:
 *    - Call getEmployeeSalaryHash with the employee's bytes32 ID
 *    - Returns the keccak256 hash of the salary string
 *
 * Examples with ethers.js:
 * // Deploy contract
 * const companyId = ethers.utils.formatBytes32String("COMP_12345");
 * const companyPayroll = await CompanyPayroll.deploy(companyId, "Acme Corporation");
 *
 * // Set employee salary
 * const employeeId = ethers.utils.formatBytes32String("EMP_001");
 * await companyPayroll.setEmployeeSalaryHash(employeeId, "5000,USD,monthly");
 *
 * // Get employee salary hash
 * const salaryHash = await companyPayroll.getEmployeeSalaryHash(employeeId);
 */

// Convert a string to bytes32
// const companyId = ethers.utils.formatBytes32String("COMP_12345");
// console.log(companyId);
// Output: 0x434f4d505f313233343500000000000000000000000000000000000000000000

contract CompanyPayroll is Ownable {
    error EmployeeIdZero();
    error SalaryEmpty();
    error SameHash();
    error CompanyIdZero();
    error CompanyNameEmpty();

    // Immutable company information (set once at deployment)
    bytes32 public immutable companyId;
    string public companyName;
    address public immutable deployer;

    // Employee salary storage
    mapping(bytes32 => bytes32) public employeeSalaryHashes;

    event SalaryHashSet(bytes32 indexed employeeId, bytes32 hash);

    /**
     * @dev Initializes contract with company information
     * @param _companyId bytes32 identifier for the company
     * @param _companyName Name of the company
     */
    constructor(bytes32 _companyId, string memory _companyName) Ownable(msg.sender) {
        // Input validation using custom errors
        if (_companyId == bytes32(0)) revert CompanyIdZero();
        if (bytes(_companyName).length == 0) revert CompanyNameEmpty();

        // Set immutable values
        companyId = _companyId;
        companyName = _companyName;
        deployer = msg.sender;
    }

    /**
     * @dev Sets/updates employee salary hash
     * Maintains previous gas optimizations with additional company context
     */
    function setEmployeeSalaryHash(bytes32 employeeId, string calldata salary) external onlyOwner {
        if (employeeId == bytes32(0)) revert EmployeeIdZero();
        if (bytes(salary).length == 0) revert SalaryEmpty();

        bytes32 newHash = keccak256(abi.encodePacked(salary));
        bytes32 currentHash = employeeSalaryHashes[employeeId];

        if (currentHash == newHash) revert SameHash();

        employeeSalaryHashes[employeeId] = newHash;
        emit SalaryHashSet(employeeId, newHash);
    }

    // Existing view function remains unchanged
    function getEmployeeSalaryHash(bytes32 employeeId) external view returns (bytes32) {
        return employeeSalaryHashes[employeeId];
    }
}
