import type { FieldHook } from "payload"

export const formatSlug: FieldHook = async ({ value, data }) => {
    // return formatted version of title if exists, else return unmodified value
    return data?.title?.replace(/ /g, '-').toLowerCase() ?? value.replace(/ /g, '-').toLowerCase();
  };