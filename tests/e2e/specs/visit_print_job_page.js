describe('Print Job page', () => {
  beforeEach(() => {
    cy.visit('/print_job')
  })

  it('Shows the correct information', () => {
    cy.contains('Select a Printer')
    cy.contains('Scan your barcode')
    cy.contains('Reset')
    cy.contains('Print')
  })

  it('Shows the correct errors when the form is submitted with no data', () => {
    cy.get('[data-attribute=print-button]').click()
    cy.contains('There must be at least one barcode')
  })

  it('PMB request is successful', () => {
    cy.get('[data-attribute=printer-select]').select('AA312bc')
    cy.get('[data-attribute=barcode-input]').type('aBarcode')

    cy.intercept('/v2/print_jobs', {
      statusCode: 200,
      body: {
        message: 'Successful',
      },
    })
    cy.get('[data-attribute=print-button]').click()
    cy.contains('Printing command sent')
  })

  it('PMB request is unsuccessful, failed response', () => {
    cy.get('[data-attribute=printer-select]').select('AA312bc')
    cy.get('[data-attribute=barcode-input]').type('aBarcode')
    cy.intercept('/v2/print_jobs', {
      statusCode: 422,
      body: {
        errors: [
          {
            source: {
              pointer: 'api/label',
            },
            detail: 'is invalid',
          },
        ],
      },
    })
    cy.get('[data-attribute=print-button]').click()
    cy.contains('Printing command failed: api/label is invalid')
  })
})
