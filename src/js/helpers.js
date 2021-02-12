import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
//goal of this file is to create couple of functions that we re-use throughout this project over and over again -> central place for them

//this promise will reject after certain amount of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: `POST`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //creating AJAX request, this will return a `PROMISE`
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //res <response> json() returns another promise which we store into our data variable
    const data = await res.json();

    //throwing in new error with message from data and response status
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //creating AJAX request, this will return a `PROMISE`
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //res <response> json() returns another promise which we store into our data variable
    const data = await res.json();

    //throwing in new error with message from data and response status
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    //creating AJAX request, this will return a `PROMISE`
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //res <response> json() returns another promise which we store into our data variable
    const data = await res.json();

    //throwing in new error with message from data and response status
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
