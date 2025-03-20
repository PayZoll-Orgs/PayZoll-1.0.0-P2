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
    error SameSalary();
    error CompanyIdZero();
    error CompanyNameEmpty();
    error EmployeeNotFound();

    // Immutable company information (set once at deployment)
    bytes32 public immutable companyId;
    string public companyName;
    address public immutable deployer;

    // Employee salary storage
    mapping(string => string) public employeeSalaries;
    string[] private employeeIds;

    event SalarySet(string indexed employeeId, string salary);
    event EmployeeDeleted(string indexed employeeId);

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
     * @dev Sets/updates employee salary
     */
    function setEmployeeSalary(string calldata employeeId, string calldata salary) external onlyOwner {
        if (bytes(employeeId).length == 0) revert EmployeeIdEmpty();
        if (bytes(salary).length == 0) revert SalaryEmpty();

        string memory currentSalary = employeeSalaries[employeeId];
        if (keccak256(abi.encodePacked(currentSalary)) == keccak256(abi.encodePacked(salary))) revert SameSalary();

        if (bytes(currentSalary).length == 0) {
            employeeIds.push(employeeId);
        }

        employeeSalaries[employeeId] = salary;
        emit SalarySet(employeeId, salary);
    }

    /**
     * @dev Retrieves employee salary
     */
    function getEmployeeSalary(string calldata employeeId) external view returns (string memory) {
        return employeeSalaries[employeeId];
    }

    /**
     * @dev Retrieves all employee details
     */
    function getAllEmployeeDetails() external view returns (string[] memory, string[] memory) {
        string[] memory salaries = new string[](employeeIds.length);
        uint256 employeesLength = employeeIds.length;
        for (uint256 i = 0; i < employeesLength; i++) {
            salaries[i] = employeeSalaries[employeeIds[i]];
        }
        return (employeeIds, salaries);
    }

    /**
     * @dev Deletes an employee record
     */
    function deleteEmployee(string calldata employeeId) external onlyOwner {
        if (bytes(employeeId).length == 0) revert EmployeeIdEmpty();
        if (bytes(employeeSalaries[employeeId]).length == 0) revert EmployeeNotFound();

        delete employeeSalaries[employeeId];

        // Remove employeeId from employeeIds array
        uint256 employeesLength = employeeIds.length;
        for (uint256 i = 0; i < employeesLength; i++) {
            if (keccak256(abi.encodePacked(employeeIds[i])) == keccak256(abi.encodePacked(employeeId))) {
                employeeIds[i] = employeeIds[employeesLength - 1]; // Move last element to deleted spot
                employeeIds.pop(); // Remove last element
                break;
            }
        }

        emit EmployeeDeleted(employeeId);
    }
}
