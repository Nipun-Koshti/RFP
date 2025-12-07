function getVendorEmails(vendor) {
  const emails = new Set();

  // Primary vendor email
  if (vendor.email) emails.add(vendor.email);

  // Nested personal emails
  if (Array.isArray(vendor.personal)) {
    vendor.personal.forEach(person => {
      if (person.email) emails.add(person.email);
    });
  }

  return Array.from(emails);
}

export default getVendorEmails