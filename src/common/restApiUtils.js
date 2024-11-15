// ------------------------------------------------------------------------------------------------
// REST API UTILITIES
// This module contains the rest api calls.
// Define the functions here and use them in the rest of the code.

// By default, use development API URLS
let mcRestApiUrl = "https://dev-aiida.materialscloud.org/mc-rest-api/mc3d/";
let aiidaRestBaseUrl = "https://dev-aiida.materialscloud.org/";

// Use production backend if specified
if (import.meta.env.VITE_PRODUCTION_BACKEND === "true") {
  mcRestApiUrl = "https://aiida.materialscloud.org/mc-rest-api/mc3d/";
  aiidaRestBaseUrl = "https://aiida.materialscloud.org/";
}

const MC_REST_API_URL = mcRestApiUrl;
const AIIDA_REST_BASE_URL = aiidaRestBaseUrl;

console.log(mcRestApiUrl);

const AIIDA_API_URLS = {
  "pbe-v1": `${AIIDA_REST_BASE_URL}/mc3d/api/v4`,
  "pbesol-v2": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v2/api/v4`,
};

// delay function for testing loading animations:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadIndex(method) {
  await delay(2000);
  let endpoint = `${MC_REST_API_URL}/${method}/entries`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching index:", error);
  }
}

export async function loadMetadata(method) {
  let endpoint = `${MC_REST_API_URL}/${method}/meta`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

export async function loadDetails(method, id) {
  let endpoint = `${MC_REST_API_URL}/${method}/entries/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

export async function loadAiidaAttributes(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/contents/attributes`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.attributes;
  } catch (error) {
    console.error("Error fetching AiiDA attributes:", error);
  }
}

export async function loadAiidaCif(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=cif&download=false`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.download.data;
  } catch (error) {
    console.error("Error fetching AiiDA cif:", error);
  }
}

export async function loadXrd(method, id) {
  // await delay(2000);
  let endpoint = `${MC_REST_API_URL}/${method}/xrd/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching XRD:", error);
    return null;
  }
}
