<template>
  <div class="p-4">
    <h1>Upload Image to S3</h1>
    <input type="file" accept="image/*" @change="onFileChange" />
    <img v-if="imageUrl" :src="imageUrl" class="mt-4 max-w-sm" />
  </div>
</template>

<script setup lang="ts">
import { provideApolloClient, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { apolloClient } from './apollo';

provideApolloClient(apolloClient);

const imageUrl = ref<string | null>(null);

const UPLOAD_MUTATION = gql\`
  mutation Upload($image: Upload!) {
    chargePartner(image: $image) {
      filename
      url
      mimetype
    }
  }
\`;

const { mutate } = useMutation(UPLOAD_MUTATION);

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  mutate({ image: file }).then(({ data }) => {
    imageUrl.value = data.chargePartner.url;
  });
}
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
