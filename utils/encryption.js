const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export async function generateEncryptionKey() {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

export async function encryptData(text) {
    try {
        const encodedKey = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(ENCRYPTION_KEY),
            "AES-GCM",
            false,
            ["encrypt"]
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(text);

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            encodedKey,
            encodedText
        );

        const encryptedArray = new Uint8Array(encryptedData);
        const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
        combinedArray.set(iv);
        combinedArray.set(encryptedArray, iv.length);

        return Buffer.from(combinedArray).toString('base64');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
}

export async function decryptData(encryptedText) {
    try {
        const encodedKey = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(ENCRYPTION_KEY),
            "AES-GCM",
            false,
            ["decrypt"]
        );

        const encryptedData = Buffer.from(encryptedText, 'base64');
        const iv = encryptedData.slice(0, 12);
        const data = encryptedData.slice(12);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            encodedKey,
            data
        );

        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
}



async function generateEncryptedCredentials() {
    const credentials = {
        SERVICE_WALLET_ADDRESS: 'GBDY7MPNHO7CB3GTI632X2WMTA5GS4YTKKEJBTGDBFJALCUKGLA2PETK',
        SERVICE_WALLET_SECRET: 'SAAJC6C4CU4S56M75BYGEKZCXJIBWT2OL57X6GCTYXQRJJ6LTX6IG6LO',
        USDC_ISSUER: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
    };

    const encrypted = {};
    for (const [key, value] of Object.entries(credentials)) {
        encrypted[key] = await encryptData(value);
    }

    console.log('Add these to your .env file:');
    console.log(`VITE_ENCRYPTED_SERVICE_WALLET=${encrypted.SERVICE_WALLET_ADDRESS}`);
    console.log(`VITE_ENCRYPTED_SERVICE_SECRET=${encrypted.SERVICE_WALLET_SECRET}`);
    console.log(`VITE_ENCRYPTED_USDC_ISSUER=${encrypted.USDC_ISSUER}`);
}

generateEncryptedCredentials();