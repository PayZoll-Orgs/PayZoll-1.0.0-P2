import { useEffect, useState } from "react";
import { isConnected, getAddress, requestAccess } from "@stellar/freighter-api";

export function useAccount() {
    const [state, setState] = useState({
        address: null,
        sequence: null,
        balances: [],
        signers: [],
        thresholds: null,
        flags: null,
        data: null,
        loading: true,
        error: null,
        refreshAccount: null,
    });

    const fetchLatestAccountData = async (address) => {
        const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
        if (!response.ok) {
            throw new Error("Failed to fetch account details from Horizon");
        }
        return await response.json();
    };

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const connected = await isConnected();
                if (!connected.isConnected) {
                    throw new Error("Freighter is not connected");
                }

                let addrResponse = await getAddress();
                if (!addrResponse.address) {
                    const accessResponse = await requestAccess();
                    if (accessResponse.error) {
                        throw new Error(accessResponse.error);
                    }
                    addrResponse = accessResponse;
                }

                if (!addrResponse.address) {
                    throw new Error("No valid address returned from Freighter");
                }

                const address = addrResponse.address;
                console.log("Freighter returned address:", address);

                const updateAccountData = async () => {
                    const accountData = await fetchLatestAccountData(address);
                    setState(prevState => ({
                        ...prevState,
                        address,
                        sequence: accountData.sequence,
                        balances: accountData.balances,
                        signers: accountData.signers,
                        thresholds: accountData.thresholds,
                        flags: accountData.flags,
                        data: accountData.data,
                        loading: false,
                        error: null,
                    }));
                };

                await updateAccountData();

                setState(prevState => ({
                    ...prevState,
                    refreshAccount: updateAccountData,
                }));
            } catch (e) {
                console.error("Error fetching account:", e);
                setState({
                    address: null,
                    sequence: null,
                    balances: [],
                    signers: [],
                    thresholds: null,
                    flags: null,
                    data: null,
                    loading: false,
                    error: e.message || "Unknown error connecting to wallet",
                    refreshAccount: null,
                });
            }
        };

        fetchAccount();
    }, []);

    return state;
}
