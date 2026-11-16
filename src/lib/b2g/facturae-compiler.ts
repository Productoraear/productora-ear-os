/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — COMPILADOR DE FACTURAE XML v3.2.2 CON CÓDIGOS DIR3
 * ════════════════════════════════════════════════════════════════════════════
 * Generador de factura electrónica homologada para la Administración Pública
 * Española (FACe / Punto General de Entrada de Facturas Electrónicas):
 *  - Estándar Facturae v3.2.2 (Esquema oficial Ministerio de Hacienda).
 *  - Triplete DIR3: Oficina Contable, Órgano Gestor y Unidad Tramitadora.
 *  - Desglose de bases imponibles e IVA en céntimos con precisión legal.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface Dir3Codes {
  oficinaContable: string;   // e.g. "L01280068"
  organoGestor: string;      // e.g. "L01280068"
  unidadTramitadora: string; // e.g. "L01280068"
}

export interface FacturaeParty {
  name: string;
  taxId: string; // CIF / NIF
  address: string;
  postalCode: string;
  town: string;
  province: string;
  countryCode?: string; // ESP
}

export interface FacturaeItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  vatRatePercent: number;
}

export interface FacturaePayload {
  invoiceNumber: string;
  invoiceSeries?: string;
  issueDate: string; // YYYY-MM-DD
  dir3: Dir3Codes;
  issuer: FacturaeParty;
  receiver: FacturaeParty;
  items: FacturaeItem[];
  paymentIban: string;
}

export function compileFacturaeXml(payload: FacturaePayload): string {
  const series = payload.invoiceSeries ?? 'B2G';
  const fullNumber = `${series}-${payload.invoiceNumber}`;

  let totalBaseCents = 0;
  let totalVatCents = 0;

  const itemXmlLines = payload.items.map((item) => {
    totalBaseCents += item.totalCents;
    const vatForThisItem = Math.round((item.totalCents * item.vatRatePercent) / 100);
    totalVatCents += vatForThisItem;

    return `        <InvoiceLine>
          <ItemDescription>${item.description}</ItemDescription>
          <Quantity>${item.quantity.toFixed(2)}</Quantity>
          <UnitOfMeasure>01</UnitOfMeasure>
          <UnitPriceWithoutTax>${(item.unitPriceCents / 100).toFixed(2)}</UnitPriceWithoutTax>
          <TotalCost>${(item.totalCents / 100).toFixed(2)}</TotalCost>
          <GrossAmount>${(item.totalCents / 100).toFixed(2)}</GrossAmount>
          <TaxesOutputs>
            <Tax>
              <TaxTypeCode>01</TaxTypeCode>
              <TaxRate>${item.vatRatePercent.toFixed(2)}</TaxRate>
              <TaxableBase>
                <TotalAmount>${(item.totalCents / 100).toFixed(2)}</TotalAmount>
              </TaxableBase>
              <TaxAmount>
                <TotalAmount>${(vatForThisItem / 100).toFixed(2)}</TotalAmount>
              </TaxAmount>
            </Tax>
          </TaxesOutputs>
        </InvoiceLine>`;
  }).join('\n');

  const totalInvoiceCents = totalBaseCents + totalVatCents;

  return `<?xml version="1.0" encoding="UTF-8"?>
<fe:Facturae xmlns:fe="http://www.facturae.es/Facturae/2014/v3.2.2/Facturae"
             xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
  <FileHeader>
    <SchemaVersion>3.2.2</SchemaVersion>
    <Modality>I</Modality>
    <InvoiceIssuerType>EM</InvoiceIssuerType>
    <Batch>
      <BatchIdentifier>${fullNumber}</BatchIdentifier>
      <InvoicesCount>1</InvoicesCount>
      <TotalInvoicesAmount>
        <TotalAmount>${(totalInvoiceCents / 100).toFixed(2)}</TotalAmount>
      </TotalInvoicesAmount>
      <TotalOutstandingAmount>
        <TotalAmount>${(totalInvoiceCents / 100).toFixed(2)}</TotalAmount>
      </TotalOutstandingAmount>
      <TotalExecutableAmount>
        <TotalAmount>${(totalInvoiceCents / 100).toFixed(2)}</TotalAmount>
      </TotalExecutableAmount>
      <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
    </Batch>
  </FileHeader>
  <Parties>
    <SellerParty>
      <TaxIdentification>
        <PersonTypeCode>J</PersonTypeCode>
        <ResidenceTypeCode>R</ResidenceTypeCode>
        <TaxIdentificationNumber>${payload.issuer.taxId}</TaxIdentificationNumber>
      </TaxIdentification>
      <LegalEntity>
        <CorporateName>${payload.issuer.name}</CorporateName>
        <AddressInSpain>
          <Address>${payload.issuer.address}</Address>
          <PostCode>${payload.issuer.postalCode}</PostCode>
          <Town>${payload.issuer.town}</Town>
          <Province>${payload.issuer.province}</Province>
          <CountryCode>ESP</CountryCode>
        </AddressInSpain>
      </LegalEntity>
    </SellerParty>
    <BuyerParty>
      <TaxIdentification>
        <PersonTypeCode>J</PersonTypeCode>
        <ResidenceTypeCode>R</ResidenceTypeCode>
        <TaxIdentificationNumber>${payload.receiver.taxId}</TaxIdentificationNumber>
      </TaxIdentification>
      <AdministrativeCentres>
        <AdministrativeCentre>
          <CentreCode>${payload.dir3.oficinaContable}</CentreCode>
          <RoleTypeCode>01</RoleTypeCode>
          <Name>Oficina Contable</Name>
        </AdministrativeCentre>
        <AdministrativeCentre>
          <CentreCode>${payload.dir3.organoGestor}</CentreCode>
          <RoleTypeCode>02</RoleTypeCode>
          <Name>Órgano Gestor</Name>
        </AdministrativeCentre>
        <AdministrativeCentre>
          <CentreCode>${payload.dir3.unidadTramitadora}</CentreCode>
          <RoleTypeCode>03</RoleTypeCode>
          <Name>Unidad Tramitadora</Name>
        </AdministrativeCentre>
      </AdministrativeCentres>
      <LegalEntity>
        <CorporateName>${payload.receiver.name}</CorporateName>
        <AddressInSpain>
          <Address>${payload.receiver.address}</Address>
          <PostCode>${payload.receiver.postalCode}</PostCode>
          <Town>${payload.receiver.town}</Town>
          <Province>${payload.receiver.province}</Province>
          <CountryCode>ESP</CountryCode>
        </AddressInSpain>
      </LegalEntity>
    </BuyerParty>
  </Parties>
  <Invoices>
    <Invoice>
      <InvoiceHeader>
        <InvoiceNumber>${payload.invoiceNumber}</InvoiceNumber>
        <InvoiceSeriesCode>${series}</InvoiceSeriesCode>
        <InvoiceDocumentType>FC</InvoiceDocumentType>
        <InvoiceClass>OO</InvoiceClass>
      </InvoiceHeader>
      <InvoiceIssueData>
        <IssueDate>${payload.issueDate}</IssueDate>
        <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
        <TaxCurrencyCode>EUR</TaxCurrencyCode>
        <LanguageCode>es</LanguageCode>
      </InvoiceIssueData>
      <TaxesOutputs>
        <Tax>
          <TaxTypeCode>01</TaxTypeCode>
          <TaxRate>21.00</TaxRate>
          <TaxableBase>
            <TotalAmount>${(totalBaseCents / 100).toFixed(2)}</TotalAmount>
          </TaxableBase>
          <TaxAmount>
            <TotalAmount>${(totalVatCents / 100).toFixed(2)}</TotalAmount>
          </TaxAmount>
        </Tax>
      </TaxesOutputs>
      <InvoiceTotals>
        <TotalGrossAmount>${(totalBaseCents / 100).toFixed(2)}</TotalGrossAmount>
        <TotalGeneralDiscounts>0.00</TotalGeneralDiscounts>
        <TotalGeneralSurcharges>0.00</TotalGeneralSurcharges>
        <TotalTotalGrossAmountAfterDiscounts>${(totalBaseCents / 100).toFixed(2)}</TotalTotalGrossAmountAfterDiscounts>
        <TotalGrossAmountBeforeTaxes>${(totalBaseCents / 100).toFixed(2)}</TotalGrossAmountBeforeTaxes>
        <TotalTaxOutputs>${(totalVatCents / 100).toFixed(2)}</TotalTaxOutputs>
        <TotalTaxesWithheld>0.00</TotalTaxesWithheld>
        <InvoiceTotal>${(totalInvoiceCents / 100).toFixed(2)}</InvoiceTotal>
        <TotalOutstandingAmount>${(totalInvoiceCents / 100).toFixed(2)}</TotalOutstandingAmount>
        <TotalExecutableAmount>${(totalInvoiceCents / 100).toFixed(2)}</TotalExecutableAmount>
      </InvoiceTotals>
      <Items>
${itemXmlLines}
      </Items>
      <PaymentDetails>
        <Installment>
          <InstallmentDueDate>${payload.issueDate}</InstallmentDueDate>
          <InstallmentAmount>${(totalInvoiceCents / 100).toFixed(2)}</InstallmentAmount>
          <PaymentMeans>04</PaymentMeans>
          <AccountToBeCredited>
            <IBAN>${payload.paymentIban.replace(/\s+/g, '')}</IBAN>
          </AccountToBeCredited>
        </Installment>
      </PaymentDetails>
    </Invoice>
  </Invoices>
</fe:Facturae>`;
}
