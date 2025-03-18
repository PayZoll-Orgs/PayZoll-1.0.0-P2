// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BulkPayroll is ReentrancyGuard {
    using SafeERC20 for IERC20;

    event BulkTransferExecuted(
        address indexed sender, address indexed token, uint256 totalRecipients, uint256 totalAmount
    );

    /**
     * @notice Executes a bulk transfer of tokens from the caller to a list of recipients.
     * @param token The address of the ERC20 token.
     * @param recipients An array of recipient addresses.
     * @param amounts An array of token amounts corresponding to each recipient.
     */
    function bulkTransfer(address token, address[] calldata recipients, uint256[] calldata amounts)
        external
        payable
        nonReentrant
    {
        require(recipients.length == amounts.length, "Recipients and amounts length mismatch");

        if (token == address(0)) {
            // Native token transfer
            uint256 totalAmount = 0;
            for (uint256 i = 0; i < amounts.length; i++) {
                totalAmount += amounts[i];
            }
            require(msg.value >= totalAmount, "Insufficient ETH sent");

            for (uint256 i = 0; i < recipients.length; i++) {
                payable(recipients[i]).transfer(amounts[i]);
            }

            // Return excess ETH if any
            if (msg.value > totalAmount) {
                payable(msg.sender).transfer(msg.value - totalAmount);
            }
        } else {
            // ERC20 token transfer
            IERC20 erc20 = IERC20(token);
            for (uint256 i = 0; i < recipients.length; i++) {
                erc20.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
            }
        }

        emit BulkTransferExecuted(msg.sender, token, recipients.length, 0);
    }
}
