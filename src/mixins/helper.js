// Make requests to CryptoCompare API
export async function makeApiRequest(path) {
    try {
        const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
        return response.json();
    } catch(error) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}