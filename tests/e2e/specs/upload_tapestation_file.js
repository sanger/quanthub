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
    cy.get('.row > h3').contains('210825-105408-')
    cy.get('td').should('have.length', 96)

    cy.visit('#/plates')
    cy.contains('210825-105408-').click()
    cy.get('.row > h3').contains('210825-105408-')
  })
})
