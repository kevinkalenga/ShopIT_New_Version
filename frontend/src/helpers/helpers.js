
export const getPriceQueryParams = (searchParams, key, value) => {
    const newParams = new URLSearchParams(searchParams); // clone proprement

    if (key === "min") {
        // Update the key to match query structure
        key = "price[gte]";
    } else if (key === "max") {
        key = "price[lte]";
    }

    if (value) {
        // add the new value
        newParams.set(key, value);
    } else {
        newParams.delete(key);
    }

    return newParams;
} 






