const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
const StellarSdk = require('@stellar/stellar-sdk');

const port = 5001;


// Allow multiple origins
const allowedOrigins = [
  "https://www.payzoll.in/",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Temporarily allow all origins in development
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

// const router = require("./routes/router");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const adminRouter = require("./routes/adminRouter");
const authRouter = require("./Controllers/authController");
const payrollRouter = require("./routes/payrollRouter");
const tokenRouter = require("./routes/tokenrouter");
const employeeRouter = require("./routes/employeeRouter");
const lendingRouter = require("./routes/lendingRouter");
const borrowingRouter = require("./routes/borrowingRouter");
const { validationResult } = require('express-validator');

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use(
  "/admin",
  authRouter.isLoggedIn,
  authRouter.checkForEmployeer,
  adminRouter
);
app.use(
  "/payroll",
  authRouter.isLoggedIn,
  authRouter.checkForEmployeer,
  payrollRouter
);
app.use(
  "/token",
  authRouter.isLoggedIn,
  authRouter.checkForEmployeer,
  tokenRouter
);

app.use(
  "/employee",
  authRouter.isLoggedIn,
  authRouter.checkForEmployee,
  employeeRouter
);

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);


async function sendUsdc(recipient, amount) {
  try {
    console.log('Starting USDC transfer process...');

    // Step 1: Get credentials
    console.log('Step 1: Loading credentials and configuration');
    const serviceAuth = process.env.SERVICE_CONTRACT_AUTH;
    const serviceAddress = process.env.SERVICE_CONTRACT_ADDRESS;
    const usdcIssuer = process.env.USDC_ISSUER;

    if (!serviceAuth || !serviceAddress || !usdcIssuer) {
      throw new Error('Missing required environment variables');
    }

    // Step 2: Create keypair from secret
    console.log('Step 2: Creating service account keypair');
    const serviceKeypair = StellarSdk.Keypair.fromSecret(serviceAuth);

    // Step 3: Load account details
    console.log('Step 3: Loading account from Stellar network');
    const account = await server.loadAccount(serviceAddress);
    console.log(`Account loaded: ${serviceAddress}`);

    // Step 4: Fetch network base fee
    console.log('Step 4: Fetching network base fee');
    const fee = await server.fetchBaseFee();
    console.log(`Current base fee: ${fee}`);

    // Step 5: Create asset object
    console.log('Step 5: Creating USDC asset object');
    const usdcAsset = new StellarSdk.Asset('USDC', usdcIssuer);

    // Step 6: Build transaction
    console.log(`Step 6: Building transaction to send ${amount} USDC to ${recipient}`);
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: recipient,
        asset: usdcAsset,
        amount: parseFloat(amount).toFixed(7),
      }))
      .setTimeout(30)
      .build();

    // Step 7: Sign transaction
    console.log('Step 7: Signing transaction with service account');
    transaction.sign(serviceKeypair);

    // Step 8: Submit transaction
    console.log('Step 8: Submitting transaction to Stellar network');
    const result = await server.submitTransaction(transaction);
    console.log(`Transaction successful! Hash: ${result.hash}, Ledger: ${result.ledger}`);

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger
    };

  } catch (error) {
    console.error('USDC transfer failed:', error);
    console.error('Error details:', error.response?.data || 'No additional details');
    throw new Error(`Transfer failed: ${error.message}`);
  }
}

app.post("/stellar/transfer/usdc", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Received USDC transfer request');

    const { recipient, amount } = req.body;
    console.log(`Processing transfer of ${amount} USDC to ${recipient}`);

    // Execute transfer
    const result = await sendUsdc(recipient, amount);

    console.log('Transfer completed successfully');
    res.json({
      success: true,
      transaction: result
    });

  } catch (error) {
    console.error('API error in /stellar/transfer/usdc:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


app.post("/ping", async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`Received ping with message: ${message}`);
    res.json({ message: `Pong: ${message}` });
  } catch (error) {
    console.error('API error in /ping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.use("/lending", authRouter.isLoggedIn, lendingRouter);
app.use("/borrowing", authRouter.isLoggedIn, borrowingRouter);
//  404 handler middleware
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
