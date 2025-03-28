stellar contract id asset --asset <ASSET> --network <NETWORK>
( get the asset id for assets )

holder CCWDOU4VSL4GPLBV7NVJ5ZAIEBGM3IG7VHKRISGTAT47RKEIUNIBC6RIcd

stellar contract invoke \
  --id CAAX52OHYPSYCUFTEO4FHQL345SYQD6D7JAGSPOFNMXXQJXO6DAHN3QR \
  --source alice \
  --network testnet \
  --verbose \
  -- \
  bulk_transfer \
  --sender GAJ4L7FY72JDCTRLWRAPUCNZJESEJRJPGQNYZRB25AWA4ZIQLNNGET5L \
  --token_id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --recipients '["GBBYTVWHN3BOLR47BZXQ5E3BVUVYC2JFKJSYNWBU3DANZYUKPC2WBLTG"]' \
  --amounts '["1000000000"]'

stellar contract invoke \
  --id CAAX52OHYPSYCUFTEO4FHQL345SYQD6D7JAGSPOFNMXXQJXO6DAHN3QR \
  --source alice \
  --network testnet \
  --verbose \
  -- \
  bulk_transfer \
  --sender GAJ4L7FY72JDCTRLWRAPUCNZJESEJRJPGQNYZRB25AWA4ZIQLNNGET5L \
  --token_id CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --recipients '["GBBYTVWHN3BOLR47BZXQ5E3BVUVYC2JFKJSYNWBU3DANZYUKPC2WBLTG"]' \
  --amounts '["100000000"]'

USDC ( but not working )

 stellar contract id asset \
--network testnet \
--asset USDC:GCYEIQEWOCTTSA72VPZ6LYIZIK4W4KNGJR72UADIXUXG45VDFRVCQTYE
CD6ZUMPDGJLXJGMKBEMATOFTES7B7VLWPEDKQKLNMWKV7IDJWYDKHK75


stellar contract id asset --network testnet --asset native
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC



USDC (centre.io)

 stellar contract id asset \
--network testnet \
--asset USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5

CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA




    // const sendUsdcFromUser = async () => {
    //     setLoading(true);
    //     setStatus('Starting transaction');

    //     try {

    //         const serviceKeypair = StellarSdk.Keypair.fromSecret(SERVICE_CONTRACT_AUTH);

    //         const server = new StellarSdk.Horizon.Server(HORIZON_URL);
    //         // Load the user's account from Horizon.
    //         const account = await server.loadAccount(SERVICE_CONTRACT_ADDRESS);

    //         setStatus('Building transaction');

    //         // Fetch the current base fee from Horizon.
    //         const fee = await server.fetchBaseFee();

    //         // Define the USDC asset.
    //         const usdcAsset = new StellarSdk.Asset('USDC', USDC_ISSUER);

    //         // Create a payment operation to send USDC.
    //         const paymentOp = StellarSdk.Operation.payment({
    //             destination: recipient,
    //             asset: usdcAsset,
    //             amount: parseFloat(usdcAmount).toFixed(7),
    //         });

    //         // Build the transaction.
    //         const transaction = new StellarSdk.TransactionBuilder(account, {
    //             fee: fee.toString(),
    //             networkPassphrase: StellarSdk.Networks.TESTNET,
    //         })
    //             .addOperation(paymentOp)
    //             .setTimeout(30)
    //             .build();

    //         setStatus('Requesting signature');


    //         transaction.sign(serviceKeypair);
    //         // Submit the signed transaction to Horizon.
    //         const result = await server.submitTransaction(transaction);
    //         setStatus('Transaction submitted successfully');
    //         console.log('Transaction result:', result);
    //     } catch (error) {
    //         console.error('Transaction failed:', error);
    //         setStatus(`Error: ${error.message}`);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
