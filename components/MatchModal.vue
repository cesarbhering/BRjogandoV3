<template>
  <!--
// v0 by Vercel.
// https://v0.dev/t/Q8c8B1TKBVt
-->
  <section
    class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75"
  >
    <div
      class="bg-white dark:bg-zinc-950 rounded-lg shadow-xl w-4/5 md:w-1/2 lg:w-1/3"
    >
      <h2 class="text-xl font-bold text-center p-4">Team Roster</h2>
      <div class="grid grid-cols-2 divide-x">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">Team A</h3>
          <ul class="divide-y divide-gray-200">
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 1</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 2</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 3</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 4</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 5</span>
            </li>
          </ul>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">Team B</h3>
          <ul class="divide-y divide-gray-200">
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 1</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 2</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 3</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 4</span>
            </li>
            <li class="flex items-center py-2">
              <img
                src="/placeholder.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              /><span>Player 5</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Betting Odds</h3>
        <ul class="divide-y divide-gray-200">
          <li class="flex items-center justify-between py-2">
            <span>Bookmaker 1</span><span>1.5 : 2.5</span>
          </li>
          <li class="flex items-center justify-between py-2">
            <span>Bookmaker 2</span><span>1.7 : 2.3</span>
          </li>
          <li class="flex items-center justify-between py-2">
            <span>Bookmaker 3</span><span>1.6 : 2.4</span>
          </li>
        </ul>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Relevant Links</h3>
        <ul class="divide-y divide-gray-200">
          <li class="flex items-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-gray-500"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path></svg
            ><a
              href="#"
              class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >Stream Page</a
            >
          </li>
          <li class="flex items-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-gray-500"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path>
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style lang="scss" scoped>
</style>