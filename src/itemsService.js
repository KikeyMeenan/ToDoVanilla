//can hopefully change this someday
const apiUrl = window.location.origin + '/';

export const getAllItems = async () => {
  let response = await fetch(apiUrl + `items`);
  let data = await response.json()
  return data;
}

export const addItem = async (newItem) => {
    //validate here?

    const response = await fetch(apiUrl + `item`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(newItem) // body data type must match "Content-Type" header
    });

    //handle errors here?
    return await response;
}

export const updateItem = async (updatedItem) => {
    //validate here?

    const response = await fetch(apiUrl + `item`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(updatedItem) // body data type must match "Content-Type" header
    });

    //handle errors here?
    return await response;
}