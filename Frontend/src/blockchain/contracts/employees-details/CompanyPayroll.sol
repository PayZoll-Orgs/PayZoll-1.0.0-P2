// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Company Payroll
 * @dev Gas-optimized payroll system with company metadata and deployer tracking
 */
contract CompanyPayroll is Ownable {
    error EmployeeIdEmpty();
    error SalaryEmpty();
    error SameSalary();
    error CompanyIdEmpty();
    error CompanyNameEmpty();
    error EmployeeNotFound();
    error MismatchedArrayLengths();

    // Immutable company information (set once at deployment)
    string public companyId;
    string public companyName;
    address public immutable deployer;

    // Employee salary storage
    mapping(string => string) private employeeSalaries;
    mapping(string => uint256) private employeeIndex;
    string[] private employeeIds;

    event SalarySet(string indexed employeeId, string salary);
    event EmployeeDeleted(string indexed employeeId);

    /**
     * @dev Initializes contract with company information
     * @param _companyId string identifier for the company
     * @param _companyName Name of the company
     */
    constructor(string memory _companyId, string memory _companyName) Ownable(msg.sender) {
        if (bytes(_companyId).length == 0) revert CompanyIdEmpty();
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

        if (keccak256(bytes(employeeSalaries[employeeId])) == keccak256(bytes(salary))) revert SameSalary();

        if (bytes(employeeSalaries[employeeId]).length == 0) {
            employeeIndex[employeeId] = employeeIds.length;
            employeeIds.push(employeeId);
        }

        employeeSalaries[employeeId] = salary;
        emit SalarySet(employeeId, salary);
    }

    /**
     * @dev Bulk add employee salaries
     */
    function bulkAddEmployees(string[] calldata employeeIdsArray, string[] calldata salariesArray) external onlyOwner {
        if (employeeIdsArray.length != salariesArray.length) revert MismatchedArrayLengths();

        for (uint256 i = 0; i < employeeIdsArray.length; i++) {
            string memory employeeId = employeeIdsArray[i];
            string memory salary = salariesArray[i];

            if (bytes(employeeId).length == 0) revert EmployeeIdEmpty();
            if (bytes(salary).length == 0) revert SalaryEmpty();

            if (bytes(employeeSalaries[employeeId]).length == 0) {
                employeeIndex[employeeId] = employeeIds.length;
                employeeIds.push(employeeId);
            }

            employeeSalaries[employeeId] = salary;
            emit SalarySet(employeeId, salary);
        }
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
        uint256 length = employeeIds.length;
        string[] memory salaries = new string[](length);
        for (uint256 i = 0; i < length; i++) {
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

        uint256 index = employeeIndex[employeeId];
        uint256 lastIndex = employeeIds.length - 1;
        string memory lastEmployee = employeeIds[lastIndex];

        employeeIds[index] = lastEmployee;
        employeeIndex[lastEmployee] = index;
        employeeIds.pop();

        delete employeeSalaries[employeeId];
        delete employeeIndex[employeeId];

        emit EmployeeDeleted(employeeId);
    }
}
