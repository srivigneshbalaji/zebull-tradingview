// Make requests to CryptoCompare API
export async function makeApiRequest(path,requestOptions) {
    try {
        const response = await fetch(path,requestOptions);
        return response.json();
    } catch(error) {
        throw new Error(`zebull symbols request error: ${error.status}`);
    }
}


export async function fetchfromZebullAPI(path,requestOptions) {
    
    try {
        const response = await fetch(path,requestOptions);
        return response.json();
    } catch(error) {
        throw new Error(`zebull fetch request error: ${error.status}`);
    }
}