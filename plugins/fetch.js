import { defineNuxtPlugin } from "nuxt/app";

// a nuxt3 plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook();
  nuxtApp.provide("restCall", {
    get: (endpoint, params) =>
      $fetch(endpoint, {
        method: "GET",
        params
      }).catch((error) => console.log(`Erro na chamada a API: ${error}`)),
    post: (endpoint, params, body={}) =>
      $fetch(endpoint, {
        method: "POST",
        params,
        body
      }),
    patch: (endpoint, params, body={}) =>
      $fetch(endpoint, {
        method: "PATCH",
        params,
        body
      }).catch((error) => console.log(`Erro na chamada a API: ${error}`)),
    put: (endpoint, params, body={}) =>
      $fetch(endpoint, {
        method: "PUT",
        params,
        body
      }).catch((error) => console.log(`Erro na chamada a API: ${error}`)),
      delete: (endpoint, params, body={}) =>
      $fetch(endpoint, {
        method: "DELETE",
        params,
        body
      }).catch((error) => console.log(`Erro na chamada a API: ${error}`)),
  });
});
