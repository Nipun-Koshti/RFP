function generateVendorEmailHTML(rfp, vendor) {
  // Create line item rows
  const lineItemsHTML = rfp.lineItem
    .map(
      (item) => `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.name}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.description}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align:center;">${item.quantity}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align:right;">${item.unitPrice==0?"vendor can decide":item.unitPrice}</td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; color: #333; padding: 20px;">

  <!-- Hidden Metadata for LLM tracking -->
  <div style="display:none; visibility:hidden; font-size:0;">
    RFP_METADATA: {
      "rfpId": "${rfp._id}",
      "vendorId": "${vendor._id}",
      "subject": "${rfp.subject}",
      "budget": "${rfp.budget}",
      "delivery": "${rfp.delivery}",
      "remark": "${rfp.remark}"
    }
  </div>

  <h2 style="color:#2c3e50;">Request for Proposal – ${rfp.subject}</h2>

  <p>Dear ${vendor.vendorName},</p>

  <p>
    We are reaching out to request a quotation for the following requirement.
    Below are the RFP details for your reference.
  </p>

  <h3>RFP Summary</h3>
  <p><strong>Proposal ID:</strong> ${rfp._id}</p>
  <p><strong>Vendor ID:</strong> ${vendor._id}</p>
  <p><strong>Budget:</strong> ₹${rfp.budget}</p>
  <p><strong>Billing Address:</strong> ${rfp.billingAddress}</p>
  <p><strong>Expected Delivery:</strong> ${new Date(rfp.delivery).toDateString()}</p>
  <p><strong>Remark:</strong> ${rfp.remark}</p>

  <h3>Line Items</h3>

  <table style="width:100%; border-collapse:collapse; border:1px solid #ccc;">
    <thead>
      <tr style="background:#f4f6f6;">
        <th style="border:1px solid #ccc; padding:8px;">Item</th>
        <th style="border:1px solid #ccc; padding:8px;">Description</th>
        <th style="border:1px solid #ccc; padding:8px; text-align:center;">Qty</th>
        <th style="border:1px solid #ccc; padding:8px; text-align:right;">Unit Price</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHTML}
    </tbody>
  </table>

  <br />

  <p>
    Please share your quotation, delivery timelines, GST details, and any terms or conditions.
    Kindly reply within this email thread so our system can automatically identify your response.
  </p>

  <p>Regards,<br><strong>Your Company Name</strong></p>

</body>
</html>
`;
}

export default generateVendorEmailHTML