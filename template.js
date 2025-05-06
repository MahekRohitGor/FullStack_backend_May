var globals = require("./config/constants");
var exports = module.exports = {};

exports.ticketConfirmationEmail = function (ticketData) {
    const template = `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Order Confirmation - Cargo Rider</title>
          <style type="text/css">
             @media only screen and (max-width: 480px) {
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                  -webkit-text-size-adjust: none !important
              }
              body {
                  width: 100% !important;
                  min-width: 100% !important
              }
              td[id=bodyCell] {
                  padding: 10px !important
              }
              table.kmMobileHide {
                  display: none !important
              }
              table[class=kmTextContentContainer] {
                  width: 100% !important
              }
              table[class=kmBoxedTextContentContainer] {
                  width: 100% !important
              }
              td[class=kmImageContent] {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              img[class=kmImage],
              img.kmImage {
                  width: 100% !important
              }
              td.kmMobileStretch {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              table[class=kmSplitContentLeftContentContainer],
              table.kmSplitContentLeftContentContainer,
              table[class=kmSplitContentRightContentContainer],
              table.kmSplitContentRightContentContainer,
              table[class=kmColumnContainer],
              td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
              td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
              table[class=kmVerticalButton],
              table[class=kmVerticalButtonContent] {
                  width: 100% !important
              }
              td[class=kmButtonCollectionInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important;
                  padding-top: 9px !important;
                  padding-bottom: 0 !important;
                  background-color: transparent !important
              }
              td[class=kmVerticalButtonIconContent],
              td[class=kmVerticalButtonTextContent],
              td[class=kmVerticalButtonContentOuter] {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  padding-bottom: 9px !important
              }
              table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
              table[class=kmColumnContainer] td[class=kmTextContent],
              table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
              table.kmSplitContentLeftContentContainer td.kmImageContent,
              table.kmSplitContentRightContentContainer td.kmImageContent {
                  padding-top: 9px !important
              }
              td[class="rowContainer kmFloatLeft"],
              td.rowContainer.kmFloatLeft,
              td[class="rowContainer kmFloatLeft firstColumn"],
              td.rowContainer.kmFloatLeft.firstColumn,
              td[class="rowContainer kmFloatLeft lastColumn"],
              td.rowContainer.kmFloatLeft.lastColumn {
                  float: left;
                  clear: both;
                  width: 100% !important
              }
              table[class=templateContainer],
              table[class="templateContainer brandingContainer"],
              div[class=templateContainer],
              div[class="templateContainer brandingContainer"],
              table[class=templateRow] {
                  max-width: 600px !important;
                  width: 100% !important
              }
              h1 {
                  font-size: 24px !important;
                  line-height: 130% !important
              }
              h2 {
                  font-size: 20px !important;
                  line-height: 130% !important
              }
              h3 {
                  font-size: 18px !important;
                  line-height: 130% !important
              }
              h4 {
                  font-size: 16px !important;
                  line-height: 130% !important
              }
              td[class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important
              }
              td[class=kmTextBlockInner] td[class=kmTextContent] {
                  padding-right: 18px !important;
                  padding-left: 18px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important
              }
              }

            .order-details {
              background: #f8f9fa;
              border-radius: 4px;
              padding: 15px;
              margin-bottom: 20px;
            }
            .section-title {
              color: #2c3e50;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .detail-row {
              margin-bottom: 8px;
            }
            .detail-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .payment-summary {
              background: #e8f8f5;
              padding: 15px;
              border-radius: 4px;
            }
          </style>
          <!--[if mso]>
          <style>
            .templateContainer {
              border: 1px none #aaaaaa;
              background-color: #FFFFFF;
            }
            #brandingContainer {
              background-color: transparent !important;
              border: 0;
            }
            .templateContainerInner {
              padding: 0px;
            }
          </style>
          <![endif]-->
        </head>
        <body style="margin:0;padding:0;background-color:#FFF">
          <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
              <tbody>
                <tr>
                  <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:30px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                    <!--[if !mso]><!-->
                    <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
                      <div class="templateContainerInner" style="padding:0">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                          <tr>
                            <td align="center" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-bottom:20px;">
                              <img src="https://example.com/logo.png" alt="Ticket Purchase App" width="180" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none;max-width:100%;">
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Order Confirmation Title -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                          <tr>
                            <td align="center" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-bottom:20px;">
                              <h1 style="color:#2c3e50;font-size:24px;margin:0;">Ticket Confirmation (#${ticketData.qrcode})</h1>
                              <p style="color:#7f8c8d;font-size:14px;margin:5px 0 0;">Title: ${ticketData.event_title}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Order Status -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;margin-bottom:20px;">
                          <tr>
                            <td align="center" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:10px;background-color:#f39c12;color:#fff;border-radius:4px;">
                              About Event: ${ticketData.event_desc}
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Order Details -->
                        <div class="order-details">
                          <h3 class="section-title">Event Information</h3>
                          <div class="detail-row">
                            <span class="detail-label">Event Date:</span>
                            <span>${ticketData.event_date}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">Event Time:</span>
                            <span>${ticketData.event_time}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">Name:</span>
                            <span>${ticketData.full_name}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">Email ID:</span>
                            <span>${ticketData.email_id}</span>
                          </div>
                        </div>
                        
                        <!-- Event Info -->
                        <div class="order-details">
                          <h3 class="section-title">Event Information</h3>
                          <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span>${ticketData.event_address}</span>
                          </div>
                        </div>
                        
                        <!-- Footer -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;margin-top:30px;">
                          <tr>
                            <td align="center" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:20px;border-top:1px solid #eee;">
                              <p style="color:#7f8c8d;font-size:14px;margin:0;">Thank you for choosing Our Application!</p>
                              <p style="color:#7f8c8d;font-size:12px;margin:5px 0 0;">If you have any questions, please contact our support team.</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!--[if !mso]><!-->
                      </div>
                    </div>
                    <!--<![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </body>
      </html>`;

    return template;
}



// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module