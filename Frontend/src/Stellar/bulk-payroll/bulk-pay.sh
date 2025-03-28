#!/bin/bash

# This script executes two bulk transfer operations using the Stellar contract.

echo "Executing first bulk transfer..."
stellar contract invoke \
  --id CAAX52OHYPSYCUFTEO4FHQL345SYQD6D7JAGSPOFNMXXQJXO6DAHN3QR \
  --source alice \
  --network testnet \
  --verbose \
  -- \
  bulk_transfer \
  --sender GAJ4L7FY72JDCTRLWRAPUCNZJESEJRJPGQNYZRB25AWA4ZIQLNNGET5L \
  --token_id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --recipients '["GBBYTVWHN3BOLR47BZXQ5E3BVUVYC2JFKJSYNWBU3DANZYUKPC2WBLTG","GBBYTVWHN3BOLR47BZXQ5E3BVUVYC2JFKJSYNWBU3DANZYUKPC2WBLTG"]' \
  --amounts '["1000000000","1000000000"]'

echo "Executing second bulk transfer..."
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