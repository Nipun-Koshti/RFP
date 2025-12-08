

export const htmlResponse = `<div id="rfq-analysis" style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; max-width: 900px; margin: auto;"> <style> #rfq-analysis h2 { margin-top: 30px; } #rfq-analysis table { width: 100%; border-collapse: collapse; margin-top: 10px; } #rfq-analysis th, #rfq-analysis td { border: 1px solid #ddd; padding: 8px; } #rfq-analysis th { background: #f5f5f5; text-align: left; } .best-vendor { background: #dfffe0; border-left: 6px solid #2ecc71; padding: 15px; margin-top: 20px; border-radius: 6px; } .score-pill { background: #2ecc71; padding: 3px 8px; border-radius: 4px; color: white; font-size: 13px; margin-left: 10px; } </style> <h1>RFQ Analysis Report</h1> <!-- RFQ SUMMARY --> <h2>RFQ Summary</h2> <p><strong>Subject:</strong> Procurement of Laptops</p> <p><strong>Budget:</strong> ₹180,000.00</p> <p><strong>Billing Address:</strong> Not provided</p> <p><strong>Delivery Required By:</strong> 2025-12-30</p> <!-- LINE ITEMS --> <h2>Line Items</h2> <table> <tr> <th>Item</th> <th>Quantity</th> <th>Description</th> <th>Unit Price (₹)</th> <th>Total (₹)</th> </tr> <tr> <td>Lenovo i5 Laptop</td> <td>10</td> <td>Not provided</td> <td>18,000.00</td> <td>180,000.00</td> </tr> </table> <!-- VENDOR COMPARISON --> <h2>Vendor Comparison</h2> <table> <tr> <th>Vendor</th> <th>Total Price (₹)</th> <th>Delivery</th> <th>Terms / Warranty</th> <th>Additional Charges</th> <th>Score</th> </tr>
<tr>
  <td>Vendor A</td>
  <td>₹175,000.00</td>
  <td>Within 10 days (ISO: 2025-12-18)</td>
  <td>1-year warranty</td>
  <td>None</td>
  <td>92.5</td>
</tr>

<tr>
  <td>Vendor B</td>
  <td>₹182,000.00</td>
  <td>Within 20 days (ISO: 2025-12-28)</td>
  <td>2-year warranty</td>
  <td>₹500.00 delivery fee</td>
  <td>85.1</td>
</tr>

<tr>
  <td>Vendor C</td>
  <td>₹190,000.00</td>
  <td>By Jan 10, 2026 (ISO: 2026-01-10)</td>
  <td>No warranty</td>
  <td>None</td>
  <td>63.4</td>
</tr>

</table> <!-- BEST VENDOR --> <div class="best-vendor"> <h2>Best Vendor: Vendor A <span class="score-pill">Score: 92.5</span></h2> <p><strong>Total Price:</strong> ₹175,000.00</p> <p><strong>Delivery:</strong> Within 10 days (2025-12-18)</p>
<h3>Why Vendor A is the Best Choice</h3>
<ul>
  <li>Lowest quoted price among all vendors.</li>
  <li>Fastest delivery timeline (10 days).</li>
  <li>No additional charges compared to others.</li>
  <li>Good warranty coverage (1 year).</li>
  <li>Strong overall value when balancing price + delivery + terms.</li>
</ul>

</div> <!-- ASSUMPTIONS --> <h2>Assumptions / Notes</h2> <ul> <li>Delivery durations were converted assuming today's date as 2025-12-08.</li> <li>Missing item descriptions defaulted to "Not provided".</li> <li>All vendors were assumed to quote for the same specifications.</li> </ul> <!-- REMARKS --> <h2>Remarks</h2> <p>No additional remarks</p> </div>`