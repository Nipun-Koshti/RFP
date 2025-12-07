export const validateVendorPayload = (data) => {
  const errors = [];

  if (!data.vendorName || data.vendorName.trim() === "") {
    errors.push("Vendor name is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || typeof data.phone !== "string") {
    errors.push("Phone number must be a number");
  }

  if (!data.gst || typeof data.gst !== "string") {
    errors.push("GST must be a number");
  }

  if (!data.address) {
    errors.push("Address is required");
  } else {
    if (!data.address.street) errors.push("Street is required");
    if (!data.address.city) errors.push("City is required");
    if (!data.address.state) errors.push("State is required");
  }

  if (!Array.isArray(data.personal)) {
    errors.push("Personal suppliers must be an array");
  } else {
    data.personal.forEach((sup, index) => {
      if (!sup.name) errors.push(`Supplier ${index + 1}: Name is required`);
      if (!sup.email || !emailRegex.test(sup.email))
        errors.push(`Supplier ${index + 1}: Valid email is required`);
      if (!sup.phone) errors.push(`Supplier ${index + 1}: Phone is required`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
