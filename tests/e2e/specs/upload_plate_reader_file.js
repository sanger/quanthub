describe('Plate Reader', () => {
  it('upload file, check plate is stored and remove it from local storage', () => {
    cy.visit('/')
    cy.get('input[type="file"]').as('fileInput').attachFile('plate_reader.csv')
    cy.get('select[id="quant-type"]').select('libraryPlateReader')
    cy.contains('button', 'Upload').click()
    cy.get('header > div').contains('DN1234567')
    cy.get('td').should('have.length', 384)

    cy.visit('#/plates')
    cy.contains('DN1234567').click()
    cy.get('header > div').contains('DN1234567')

    cy.visit('#/plates')
    cy.contains('button', 'Clear Local Storage').click()
    cy.get('.plate').should('have.length', 0)
  })
})
