export const buildFormData = (data, files = {}) => {
  const formData = new FormData()

  // append simple fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  // append files
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file)
  })

  return formData
}
