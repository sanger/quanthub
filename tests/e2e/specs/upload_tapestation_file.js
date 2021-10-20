describe('tapestation', () => {
  it('upload file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]')
      .as('fileInput')
      .attachFile(
        'DN000000  - 2021-08-25 - 10-54-08-D5000_compactRegionTable - DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv'
      )
    cy.get('select[id="quant-type"]').select('Heron TapeStation Tubes')
    cy.contains('button', 'Upload').click()
    cy.get('.row > h3').contains('compactRegionTable')
    cy.get('td').should('have.length', 96)

    cy.visit('#/plates')
    cy.contains('compactRegionTable').click()
    cy.get('.row > h3').contains('compactRegionTable')

    cy.intercept('POST', '**/qc_assays', {
      statusCode: 201,
      body: {},
    }).as('postPayload')

    cy.contains('button', 'Export').click()

    cy.fixture('tapestationRequest').then((data) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })
})
