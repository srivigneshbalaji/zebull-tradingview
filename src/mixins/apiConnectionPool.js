// Make requests to CryptoCompare API
export async function makeApiRequest(path) {
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        const response = await fetch(path,requestOptions);
        return response.json();
    } catch(error) {
        throw new Error(`zebull symbols request error: ${error.status}`);
    }
}

// Generate a symbol ID from a pair of the coins
// export function generateSymbol(exchange, fromSymbol, toSymbol) {
//     const short = `${fromSymbol}/${toSymbol}`;
//     return {
//         short,
//         full: `${exchange}:${short}`,
//     };
// }

// export function parseFullSymbol(fullSymbol) {
//     const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
//     if (!match) {
//         return null;
//     }

//     return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
// }