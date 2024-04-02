describe('tapestation', () => {
  it('upload heron tapestation file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]')
      .as('fileInput')
      .attachFile(
        'DN000000  - 2021-08-25 - 10-54-08-D5000_compactRegionTable - DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
      )
    cy.get('select[id="quant-type"]').select('Heron TapeStation Tubes')
    cy.contains('button', 'Upload').click()
    cy.contains('210825-105408-')
    cy.get('td').should('have.length', 96)

    cy.visit('#/plates')
    cy.contains('210825-105408-').click()
    cy.get('h3').contains('210825-105408-')

    // pretty basic but at least checks the warning exists. how do you make this more dynamic??
    cy.get('[data-attribute=warning-message]').contains('low conc')

    cy.intercept('POST', '**/qc_assays', {
      statusCode: 201,
      body: {},
    }).as('postPayload')

    cy.contains('button', 'Export').click()

    cy.fixture('tapestationRequest').then((data) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })

  it('upload scRNA tapestation file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]')
      .as('fileInput')
      .attachFile('10X_UAT_quantHub_TS_test_2024-03-26 - 13-35-00.csv')
    cy.get('select[id="quant-type"]').select('scRNA TapeStation Tubes')
    cy.contains('button', 'Upload').click()
    cy.contains('240326-133500-')
    cy.get('td').should('have.length', 96)

    cy.visit('#/plates')
    cy.contains('240326-133500-').click()
    cy.get('h3').contains('240326-133500-')

    cy.intercept('POST', '**/qc_assays', {
      statusCode: 201,
      body: {},
    }).as('postPayload')

    cy.contains('button', 'Export').click()

    cy.fixture('scRNATapeStationRequest').then((data) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })
})
