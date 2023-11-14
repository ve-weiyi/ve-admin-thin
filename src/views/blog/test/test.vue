<template>
  <div>
    <TablePage
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
    />
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { getColumnFields, getFormFields, getSearchFields, handleApi } from "./hook"
</script>

<style lang="scss" scoped></style>
