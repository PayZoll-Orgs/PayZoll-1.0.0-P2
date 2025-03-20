// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Company Payroll
 * @dev Gas-efficient payroll system with company metadata and deployer tracking
 */
contract CompanyPayroll is Ownable {
    error EmployeeIdEmpty();
    error SalaryEmpty();
    error SameHash();
    error CompanyIdZero();
    error CompanyNameEmpty();

    // Immutable company information (set once at deployment)
    bytes32 public immutable companyId;
    string public companyName;
    address public immutable deployer;

    // Employee salary storage
    mapping(string => string) public employeeSalaryHashes;
    string[] private employeeIds;

    event SalaryHashSet(string indexed employeeId, string hash);

    /**
     * @dev Initializes contract with company information
     * @param _companyId bytes32 identifier for the company
     * @param _companyName Name of the company
     */
    constructor(bytes32 _companyId, string memory _companyName) Ownable(msg.sender) {
        if (_companyId == bytes32(0)) revert CompanyIdZero();
        if (bytes(_companyName).length == 0) revert CompanyNameEmpty();

        companyId = _companyId;
        companyName = _companyName;
        deployer = msg.sender;
    }

    /**
     * @dev Sets/updates employee salary hash
     * Maintains previous gas optimizations with additional company context
     */
    function setEmployeeSalaryHash(string calldata employeeId, string calldata salary) external onlyOwner {
        if (bytes(employeeId).length == 0) revert EmployeeIdEmpty();
        if (bytes(salary).length == 0) revert SalaryEmpty();

        string memory newHash = string(abi.encodePacked(keccak256(abi.encodePacked(salary))));
        string memory currentHash = employeeSalaryHashes[employeeId];

        if (keccak256(abi.encodePacked(currentHash)) == keccak256(abi.encodePacked(newHash))) revert SameHash();

        if (bytes(currentHash).length == 0) {
            employeeIds.push(employeeId);
        }

        employeeSalaryHashes[employeeId] = newHash;
        emit SalaryHashSet(employeeId, newHash);
    }

    /**
     * @dev Retrieves employee salary hash
     */
    function getEmployeeSalaryHash(string calldata employeeId) external view returns (string memory) {
        return employeeSalaryHashes[employeeId];
    }

    /**
     * @dev Retrieves all employee details
     */
    function getAllEmployeeDetails() external view returns (string[] memory, string[] memory) {
        string[] memory salaries = new string[](employeeIds.length);
        uint256 employeesLength = employeeIds.length;
        for (uint256 i = 0; i < employeesLength; i++) {
            salaries[i] = employeeSalaryHashes[employeeIds[i]];
        }
        return (employeeIds, salaries);
    }
}
