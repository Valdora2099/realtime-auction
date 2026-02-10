const BASE_URL = "http://localhost:8080";

export async function registerUser(data) {
  return fetch(`${BASE_URL}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export async function getUsers() {
  return fetch(`${BASE_URL}/users/get`).then(res => res.json());
}

export async function getAuctions() {
  return fetch(`${BASE_URL}/auctions/get`).then(res => res.json());
}

export async function addBid(bid) {
  return fetch(`${BASE_URL}/bids/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bid),
  }).then(res => res.json());
}

export async function updateAuction(id, auction) {
  return fetch(`${BASE_URL}/auctions/put/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auction),
  }).then(res => res.json());
}
