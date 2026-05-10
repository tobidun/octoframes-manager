import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Invoice } from "./types";
import { fmtMoney } from "./utils";

export const generateInvoicePDF = async (
  invoice: Invoice,
  cName: (id: string) => string,
  pName: (id: string) => string,
) => {
  // Create a hidden container to render the invoice
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-2000px"; // Off-screen but in DOM
  container.style.top = "0";
  container.style.width = "800px";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);

  const sub =
    Number(invoice.amount) ||
    (invoice.items || []).reduce(
      (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
      0,
    );
  const tax = (sub * (Number(invoice.taxRate) || 0)) / 100;
  const total = sub + tax;
  const cur = invoice.currency || "GBP";

  const clientLabel = invoice.customClient || cName(invoice.clientId);
  const projectLabel =
    invoice.customProject ||
    (invoice.projectId ? pName(invoice.projectId) : "");

  container.innerHTML = `
    <div style="background-color: #111116; color: white; font-family: sans-serif; padding: 60px; border: 1px solid #1e1e24; min-height: 1131px; display: flex; flex-direction: column;">
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 60px;">
          <div>
            <div style="font-size: 24px; font-weight: 900; color: #a78bfa; letter-spacing: 0.25em; margin-bottom: 8px;">OCTOFRAMES</div>
            <div style="font-size: 10px; color: #52525b; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em;">Technical Animation Studio</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: 900; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 4px;">Official Invoice</div>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 8px;">#${invoice.invoiceNumber || invoice.id?.slice(0, 6).toUpperCase()}</div>
            <div style="font-size: 10px; color: #71717a; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Reference: ${invoice.id?.slice(0, 8)}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px;">
          <div>
            <div style="font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1e1e24; padding-bottom: 8px; margin-bottom: 12px;">Billed To</div>
            <div style="font-size: 16px; font-weight: 900; margin-bottom: 4px;">${clientLabel}</div>
            <div style="font-size: 12px; color: #71717a;">${invoice.customClient ? "Partner" : "Client"}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1e1e24; padding-bottom: 8px; margin-bottom: 12px;">Project Scope</div>
            <div style="font-size: 12px; color: #a1a1aa; font-weight: bold;">${projectLabel || "General Services"}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1e1e24; padding-bottom: 8px; margin-bottom: 12px;">Timeline</div>
            <div style="display: flex; gap: 20px;">
              <div>
                <div style="font-size: 9px; font-weight: 900; color: #3f3f46; text-transform: uppercase; margin-bottom: 4px;">Issued</div>
                <div style="font-size: 12px; font-weight: bold;">${invoice.issueDate}</div>
              </div>
              <div>
                <div style="font-size: 9px; font-weight: 900; color: #ef4444; text-transform: uppercase; margin-bottom: 4px;">Due</div>
                <div style="font-size: 12px; font-weight: bold; color: #ef4444;">${invoice.dueDate || "Receipt"}</div>
              </div>
            </div>
          </div>
        </div>

        ${
          invoice.items &&
          invoice.items.length > 0 &&
          invoice.items.some((i) => i.description)
            ? `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 60px;">
            <thead>
              <tr style="text-align: left; font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em;">
                <th style="padding: 12px 16px; border-bottom: 1px solid #1e1e24;">Description</th>
                <th style="padding: 12px 16px; border-bottom: 1px solid #1e1e24; text-align: center;">Qty</th>
                <th style="padding: 12px 16px; border-bottom: 1px solid #1e1e24; text-align: right;">Rate</th>
                <th style="padding: 12px 16px; border-bottom: 1px solid #1e1e24; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr style="font-size: 13px; color: #a1a1aa; border-bottom: 1px solid #1e1e2433;">
                  <td style="padding: 16px; font-weight: bold; color: white;">${item.description}</td>
                  <td style="padding: 16px; text-align: center;">${item.qty}</td>
                  <td style="padding: 16px; text-align: right;">${fmtMoney(item.rate, cur)}</td>
                  <td style="padding: 16px; text-align: right; font-weight: 900; color: white;">${fmtMoney((Number(item.qty) || 0) * (Number(item.rate) || 0), cur)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
            : ""
        }

        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-top: 32px; border-top: 1px solid #1e1e24;">
          <div style="width: 50%;">
            <div style="font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Notes</div>
            <div style="padding: 20px; background-color: #0c0c0f; border: 1px solid #1e1e24; border-radius: 12px; font-size: 11px; color: #71717a; line-height: 1.6; font-style: italic;">
              ${invoice.notes || "Standard payment terms apply. Please quote reference ID on transfers."}
            </div>
          </div>
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #71717a; margin-bottom: 12px;">
              <span>Subtotal</span>
              <span>${fmtMoney(sub, cur)}</span>
            </div>
            ${
              Number(invoice.taxRate) > 0
                ? `
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #71717a; margin-bottom: 24px;">
                <span>VAT / Tax (${invoice.taxRate}%)</span>
                <span>${fmtMoney(tax, cur)}</span>
              </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #1e1e24; padding-top: 24px;">
              <span style="font-size: 10px; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.2em;">Total</span>
              <span style="font-size: 28px; font-weight: 900; color: #a78bfa;">${fmtMoney(total, cur)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 60px; font-size: 9px; font-weight: 900; color: #3f3f46; text-transform: uppercase; letter-spacing: 0.2em; display: flex; justify-content: space-between;">
        <div>Octoframes Studio Manager © 2026</div>
        <div>Support@octoframes.io</div>
      </div>
    </div>
  `;

  // Wait for a brief moment to ensure styles/images are processed
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const canvas = await html2canvas(container, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      backgroundColor: "#111116",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    const fileName = (
      invoice.invoiceNumber || (invoice.id ? invoice.id.slice(0, 6) : "NEW")
    ).toUpperCase();
    pdf.save(`Invoice-${fileName}.pdf`);
  } catch (err) {
    console.error("PDF Error:", err);
    throw err;
  } finally {
    document.body.removeChild(container);
  }
};
