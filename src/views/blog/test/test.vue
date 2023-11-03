<template>
  <div>
    <TablePage
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
    />
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { getColumnFields, getFormFields, getSearchFields } from "./hook"
</script>

<style lang="scss" scoped></style>
