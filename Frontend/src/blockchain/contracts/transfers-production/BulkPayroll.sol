// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BulkPayroll is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error LengthMismatch();
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferFailed();
    error RefundFailed();

    event BulkTransferExecuted(
        address indexed sender,
        address indexed token,
        uint256 totalRecipients,
        uint256 totalAmount
    );

    /**
     * @notice Executes a bulk transfer of tokens/Native currency
     * @dev Uses checked arithmetic for sum, batch allowance check for ERC20
     * @param token ERC20 token address or address(0) for Native currency
     * @param recipients Array of recipient addresses
     * @param amounts Array of corresponding transfer amounts
     */
    function bulkTransfer(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        uint256 length = recipients.length;
        if (length != amounts.length) revert LengthMismatch();

        uint256 totalAmount;
        for (uint256 i; i < length;) {
            totalAmount += amounts[i];
            unchecked { ++i; }
        }

        if (token == address(0)) {
            _handleNativeTransfer(totalAmount, recipients, amounts);
        } else {
            _handleERC20Transfer(token, totalAmount, recipients, amounts);
        }

        emit BulkTransferExecuted(msg.sender, token, length, totalAmount);
    }

    function _handleNativeTransfer(
        uint256 totalAmount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) private {
        if (msg.value < totalAmount) revert InsufficientBalance();

        for (uint256 i; i < recipients.length;) {
            (bool success,) = recipients[i].call{value: amounts[i]}("");
            if (!success) revert TransferFailed();
            unchecked { ++i; }
        }

        _refundExcessNative(totalAmount);
    }

    function _handleERC20Transfer(
        address token,
        uint256 totalAmount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) private {
        IERC20 tokenContract = IERC20(token);
        uint256 allowance = tokenContract.allowance(msg.sender, address(this));
        if (allowance < totalAmount) revert InsufficientAllowance();

        for (uint256 i; i < recipients.length;) {
            tokenContract.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
            unchecked { ++i; }
        }
    }

    function _refundExcessNative(uint256 totalAmount) private {
        uint256 remainder = msg.value - totalAmount;
        if (remainder > 0) {
            (bool success,) = msg.sender.call{value: remainder}("");
            if (!success) revert RefundFailed();
        }
    }
}